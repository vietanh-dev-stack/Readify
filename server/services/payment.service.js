import crypto from 'crypto'
import qs from 'qs'
import moment from 'moment'
import axios from 'axios'
import Order from '../models/order.model.js'
import ApiError from '../utils/apiError.js'
import { StatusCodes } from 'http-status-codes'

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const paymentService = {

    // Vnpay
    createVNPayPayment: async (order, ipAddr) => {
        const tmnCode = process.env.VNP_TMNCODE
        const secretKey = process.env.VNP_HASH_SECRET
        const vnpUrl = process.env.VNP_URL
        const returnUrl = process.env.VNP_RETURN_URL

        const date = moment().format('YYYYMMDDHHmmss')

        let vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: order._id.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
            vnp_OrderType: 'other',
            vnp_Amount: order.finalPrice * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: date
        }

        vnpParams = sortObject(vnpParams)

        const signData = qs.stringify(vnpParams, { encode: false })

        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        vnpParams['vnp_SecureHash'] = signed

        return `${vnpUrl}?${qs.stringify(vnpParams, { encode: false })}`
    },

    verifyVNPayReturn: async (query) => {
        let vnpParams = query;
        let secureHash = vnpParams['vnp_SecureHash'];

        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        vnpParams = sortObject(vnpParams);

        const signData = qs.stringify(vnpParams, { encode: false });
        const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
        const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

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
        const isMock = process.env.MOMO_MOCK === 'true'

        if (isMock) {
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
            return `${clientUrl}/momo-mock?orderId=${order._id}&amount=${order.finalPrice}`
        }

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

        try {
            const res = await axios.post(MOMO_ENDPOINT, body)

            if (res.data && res.data.resultCode !== 0) {
                throw new Error(res.data.message || 'MoMo API returned error')
            }

            return res.data.payUrl
        } catch (error) {
            console.error('MoMo Create Payment Error:', error.response?.data || error.message)
            throw new ApiError(400, 'Thiết lập Ví MoMo không hợp lệ')
        }
    },

    verifyMomoWebhook: async (body) => {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = body

        const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`

        const expectedSignature = crypto
            .createHmac('sha256', process.env.MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex')

        if (signature !== expectedSignature) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')
        }

        const order = await Order.findById(orderId)

        if (!order) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
        }

        if (Number(resultCode) === 0) {
            order.paymentStatus = 'paid'
            order.status = 'paid'
            order.paymentRef = transId.toString()
        } else {
            order.paymentStatus = 'failed'
        }

        await order.save()

        return order
    }

}

export default paymentService
