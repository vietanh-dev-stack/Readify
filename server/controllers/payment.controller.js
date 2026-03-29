import paymentService from '../services/payment.service.js'
import Order from '../models/order.model.js'

const buildClientPaymentResultUrl = (status, orderId, message = '') => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const searchParams = new URLSearchParams()

    if (status) searchParams.set('status', status)
    if (orderId) searchParams.set('orderId', orderId)
    if (message) searchParams.set('message', message)

    return `${clientUrl}/payment-result?${searchParams.toString()}`
}

const paymentController = {

    createPayment: async (req, res, next) => {
        try {
            const orderId = req.params.orderId
            const order = await Order.findById(orderId)

            if (!order) throw new Error('Order not found')

            let paymentUrl

            if (order.paymentMethod === 'vnpay') {
                paymentUrl = await paymentService.createVNPayPayment(order, req.ip)
            } else if (order.paymentMethod === 'momo') {
                paymentUrl = await paymentService.createMomoPayment(order)
            } else {
                return res.json({ message: 'COD no payment needed' })
            }

            return res.json({ paymentUrl })

        } catch (error) {
            next(error)
        }
    },

    vnpayReturn: async (req, res, next) => {
        try {
            const order = await paymentService.verifyVNPayReturn(req.query)
            const status = order.paymentStatus === 'paid' ? 'success' : 'failed'

            return res.redirect(
                buildClientPaymentResultUrl(
                    status,
                    order._id.toString(),
                    status === 'success' ? 'Thanh toán VNPay thành công.' : 'Thanh toán VNPay thất bại.'
                )
            )
        } catch (error) {
            return res.redirect(
                buildClientPaymentResultUrl(
                    'failed',
                    '',
                    'Xác minh thanh toán VNPay thất bại hoặc chữ ký không hợp lệ.'
                )
            )
        }
    },

    momoReturn: async (req, res, next) => {
        try {
            const order = await paymentService.verifyMomoWebhook(req.query)
            const status = order.paymentStatus === 'paid' ? 'success' : 'failed'

            return res.redirect(
                buildClientPaymentResultUrl(
                    status,
                    order._id.toString(),
                    status === 'success' ? 'Thanh toán MoMo thành công.' : 'Thanh toán MoMo thất bại.'
                )
            )
        } catch (error) {
            return res.redirect(
                buildClientPaymentResultUrl(
                    'failed',
                    '',
                    'Xác minh thanh toán MoMo thất bại hoặc chữ ký không hợp lệ.'
                )
            )
        }
    },

    momoWebhook: async (req, res, next) => {
        try {
            await paymentService.verifyMomoWebhook(req.body)
            res.json({ message: 'OK' })
        } catch (error) {
            next(error)
        }
    },

    momoMockReturn: async (req, res, next) => {
        try {
            const { orderId, resultCode } = req.query;
            const order = await Order.findById(orderId);
            if (!order) throw new Error('Order not found');

            const status = Number(resultCode) === 0 ? 'success' : 'failed';
            
            if (status === 'success') {
                order.paymentStatus = 'paid';
                order.status = 'paid';
                order.paymentRef = 'MOCK_' + Date.now();
            } else {
                order.paymentStatus = 'failed';
            }
            await order.save();

            return res.redirect(
                buildClientPaymentResultUrl(
                    status,
                    order._id.toString(),
                    status === 'success' ? 'Thanh toán MoMo (MOCK) thành công.' : 'Thanh toán MoMo (MOCK) thất bại.'
                )
            );
        } catch (error) {
            return res.redirect(
                buildClientPaymentResultUrl('failed', '', 'Xác minh thanh toán MOCK thất bại.')
            );
        }
    }

}

export default paymentController
