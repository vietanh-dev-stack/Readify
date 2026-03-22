import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"

import Cart from "../models/cart.model.js"
import Address from "../models/address.model.js"
import Inventory from "../models/inventory.model.js"
import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"
import OrderItem from "../models/orderItem.model.js"

const orderService = {

    createOrder: async (userId, data) => {
        const { addressId, paymentMethod, couponCode } = data

        // 1. Get cart
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

        // 3. Get inventories
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

        // 4. Validate stock
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

        // COUPON
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

        // CREATE ORDER
        const order = await Order.create({
            userId,
            totalPrice,
            discount,
            finalPrice,
            paymentMethod,
            shippingAddress: {
                fullAddress: address.fullAddress,
                province: address.province,
                district: address.district,
                ward: address.ward,
                name: address.name,
                phone: address.phone
            }
        })

        // CREATE ORDER ITEMS
        const orderItems = orderItemsData.map(item => ({
            ...item,
            orderId: order._id
        }))

        await OrderItem.insertMany(orderItems)

        // UPDATE INVENTORY
        const bulkOps = cart.items.map(item => ({
            updateOne: {
                filter: {
                    bookId: item.bookId._id,
                    quantity: { $gte: item.quantity } // chống oversell
                },
                update: {
                    $inc: { reserved: item.quantity }
                }
            }
        }))

        await Inventory.bulkWrite(bulkOps)

        // CLEAR CART
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        )

        return order
    },

    getOrder: async (userId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Order.countDocuments({ userId })

        return {
            data: orders,
            pagination: {
                total,
                page,
                limit,
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
            ...order.toObject(),
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

        if (!['pending', 'paid'].includes(order.status)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Order cannot be cancelled')
        }

        const items = await OrderItem.find({ orderId })

        // rollback inventory
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
        await order.save()

        return order
    }

}

export default orderService