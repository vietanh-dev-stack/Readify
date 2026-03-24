import crypto from 'crypto'
import qs from 'qs'
import moment from 'moment'
import axios from 'axios'
import Order from '../models/order.model.js'
import ApiError from '../utils/apiError.js'
import { StatusCodes } from 'http-status-codes'

const paymentService = {

    // Vnpay
    createVNPayPayment: async (order, ipAddr) => {
        const tmnCode = process.env.VNP_TMNCODE
        const secretKey = process.env.VNP_HASH_SECRET
        const vnpUrl = process.env.VNP_URL
        const returnUrl = process.env.VNP_RETURN_URL

        const date = moment().format('YYYYMMDDHHmmss')

        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Amount: order.finalPrice * 100,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: order._id.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
            vnp_OrderType: 'other',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: date
        }

        const sortedParams = qs.stringify(vnpParams, { encode: false })
        const signData = sortedParams

        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(signData).digest('hex')

        return `${vnpUrl}?${sortedParams}&vnp_SecureHash=${signed}`
    },

    verifyVNPayReturn: async (query) => {
        const secureHash = query.vnp_SecureHash
        delete query.vnp_SecureHash
        delete query.vnp_SecureHashType

        const sorted = qs.stringify(query, { encode: false })

        const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET)
        const checkSum = hmac.update(sorted).digest('hex')

        if (secureHash !== checkSum) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')
        }

        const orderId = query.vnp_TxnRef
        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (query.vnp_ResponseCode === '00') {
            order.paymentStatus = 'paid'
            order.status = 'paid'
            order.paymentRef = query.vnp_TransactionNo
        } else {
            order.paymentStatus = 'failed'
        }

        await order.save()

        return order
    },

    // Momo
    createMomoPayment: async (order) => {
        const {
            MOMO_PARTNER_CODE,
            MOMO_ACCESS_KEY,
            MOMO_SECRET_KEY,
            MOMO_ENDPOINT,
            MOMO_NOTIFY_URL,
            MOMO_REDIRECT_URL
        } = process.env

        const requestId = `${Date.now()}`
        const orderId = order._id.toString()
        const amount = order.finalPrice.toString()
        const orderInfo = `Thanh toan don hang ${orderId}`

        const rawSignature =
            `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${MOMO_NOTIFY_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=captureWallet`

        const signature = crypto
            .createHmac('sha256', MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex')

        const body = {
            partnerCode: MOMO_PARTNER_CODE,
            accessKey: MOMO_ACCESS_KEY,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: MOMO_REDIRECT_URL,
            ipnUrl: MOMO_NOTIFY_URL,
            requestType: 'captureWallet',
            extraData: '',
            signature,
            lang: 'vi'
        }

        const res = await axios.post(MOMO_ENDPOINT, body)

        return res.data.payUrl
    },

    verifyMomoWebhook: async (body) => {
        const {
            orderId,
            resultCode,
            transId
        } = body

        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (resultCode === 0) {
            order.paymentStatus = 'paid'
            order.status = 'paid'
            order.paymentRef = transId
        } else {
            order.paymentStatus = 'failed'
        }

        await order.save()

        return order
    }

}

export default paymentService