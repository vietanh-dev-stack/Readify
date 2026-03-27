import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"

import Cart from "../models/cart.model.js"
import Address from "../models/address.model.js"
import Inventory from "../models/inventory.model.js"
import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"
import OrderItem from "../models/orderItem.model.js"
import User from "../models/user.model.js"

const orderService = {

    ensureAdmin: async (adminId) => {
        const admin = await User.findById(adminId).lean()

        if (!admin || admin.role !== 'admin') {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Admin role is required')
        }
    },

    createOrder: async (userId, data) => {
        const { addressId, paymentMethod, couponCode } = data

        // 1. Lấy cart + populate book
        const cart = await Cart.findOne({ userId })
            .populate('items.bookId', 'title')
            .lean()

        if (!cart || cart.items.length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart is empty')
        }

        // 2. Validate address
        const address = await Address.findOne({
            _id: addressId,
            userId
        }).lean()

        if (!address) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
        }

        // 3. Lấy inventory 1 lần
        const bookIds = cart.items.map(i => i.bookId._id)

        const inventories = await Inventory.find({
            bookId: { $in: bookIds }
        }).lean()

        const inventoryMap = new Map()
        inventories.forEach(inv => {
            inventoryMap.set(inv.bookId.toString(), inv)
        })

        let totalPrice = 0
        const orderItemsData = []

        // 4. Validate stock + build items
        for (let item of cart.items) {
            const inv = inventoryMap.get(item.bookId._id.toString())

            if (!inv) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Inventory not found')
            }

            const available = inv.quantity - (inv.reserved || 0)

            if (available < item.quantity) {
                throw new ApiError(
                    StatusCodes.BAD_REQUEST,
                    `Not enough stock for ${item.bookId.title}`
                )
            }

            totalPrice += item.priceAtTime * item.quantity

            orderItemsData.push({
                bookId: item.bookId._id,
                title: item.bookId.title || 'Unknown',
                price: item.priceAtTime,
                quantity: item.quantity
            })
        }

        // coupon
        let discount = 0

        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true
            })

            if (!coupon) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid coupon')
            }

            if (coupon.expiredAt < new Date()) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon expired')
            }

            if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon limit reached')
            }

            if (coupon.discountType === 'percent') {
                discount = (totalPrice * coupon.value) / 100
            } else {
                discount = coupon.value
            }

            discount = Math.min(discount, totalPrice)

            await Coupon.updateOne(
                { _id: coupon._id },
                { $inc: { usedCount: 1 } }
            )
        }

        const finalPrice = totalPrice - discount

        const order = await Order.create({
            userId,
            totalPrice,
            discount,
            finalPrice,
            paymentMethod,
            paymentStatus: 'pending',
            shippingAddress: {
                fullAddress: address.fullAddress,
                province: address.province,
                district: address.district,
                ward: address.ward,
                name: address.name,
                phone: address.phone
            }
        })

        // create order items
        const orderItems = orderItemsData.map(item => ({
            ...item,
            orderId: order._id
        }))

        await OrderItem.insertMany(orderItems)

        // update inventory
        const bulkOps = cart.items.map(item => ({
            updateOne: {
                filter: { bookId: item.bookId._id },
                update: {
                    $inc: { reserved: item.quantity }
                }
            }
        }))

        await Inventory.bulkWrite(bulkOps)

        // clear cart
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        )

        return order
    },

    getOrder: async (userId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit

        const [orders, total] = await Promise.all([
            Order.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments({ userId })
        ])

        return {
            data: orders,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getOrderById: async (userId, orderId) => {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (order.userId.toString() !== userId.toString()) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'No permission')
        }

        const items = await OrderItem.find({ orderId })

        return {
            order,
            items
        }
    },

    cancelOrder: async (userId, orderId) => {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (order.userId.toString() !== userId.toString()) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'No permission')
        }

        if (order.status !== 'pending') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot cancel order')
        }

        // trả lại inventory
        const items = await OrderItem.find({ orderId })

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { bookId: item.bookId },
                update: {
                    $inc: { reserved: -item.quantity }
                }
            }
        }))

        await Inventory.bulkWrite(bulkOps)

        order.status = 'cancelled'
        order.paymentStatus = 'failed'

        await order.save()

        return order
    },

    // payment success
    markOrderPaid: async (orderId, paymentRef) => {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        order.paymentStatus = 'paid'
        order.paymentRef = paymentRef
        order.status = 'paid'
        order.paidAt = new Date()

        await order.save()

        return order
    },

    // payment failed
    markOrderFailed: async (orderId) => {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        // trả lại inventory
        const items = await OrderItem.find({ orderId })

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { bookId: item.bookId },
                update: {
                    $inc: { reserved: -item.quantity }
                }
            }
        }))

        await Inventory.bulkWrite(bulkOps)

        order.paymentStatus = 'failed'
        order.status = 'cancelled'

        await order.save()

        return order
    },

    getOrdersForAdmin: async (adminId, page = 1, limit = 10, filters = {}) => {
        await orderService.ensureAdmin(adminId)

        const skip = (page - 1) * limit
        const query = {}

        if (filters.status) query.status = filters.status
        if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus
        if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('userId', 'fullName email username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Order.countDocuments(query)
        ])

        return {
            data: orders,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    getOrderDetailForAdmin: async (adminId, orderId) => {
        await orderService.ensureAdmin(adminId)

        const order = await Order.findById(orderId)
            .populate('userId', 'fullName email username')
            .lean()

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        const items = await OrderItem.find({ orderId }).lean()

        return {
            order,
            items
        }
    },

    updateOrderStatusByAdmin: async (adminId, orderId, status) => {
        await orderService.ensureAdmin(adminId)

        const allowedStatuses = ['pending', 'paid', 'shipping', 'completed', 'cancelled']

        if (!allowedStatuses.includes(status)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid order status')
        }

        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (order.status === 'cancelled' || order.status === 'completed') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update this order anymore')
        }

        if (status === 'cancelled') {
            const items = await OrderItem.find({ orderId })

            const bulkOps = items.map(item => ({
                updateOne: {
                    filter: { bookId: item.bookId },
                    update: {
                        $inc: { reserved: -item.quantity }
                    }
                }
            }))

            if (bulkOps.length) {
                await Inventory.bulkWrite(bulkOps)
            }

            order.paymentStatus = order.paymentMethod === 'cod' ? 'failed' : order.paymentStatus
        }

        if (status === 'paid') {
            order.paymentStatus = 'paid'
        }

        order.status = status
        await order.save()

        return order
    }

}

export default orderService
