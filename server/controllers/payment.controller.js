import paymentService from '../services/payment.service.js'
import Order from '../models/order.model.js'

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
            await paymentService.verifyVNPayReturn(req.query)
            res.redirect('/payment-success')
        } catch (error) {
            next(error)
        }
    },

    momoWebhook: async (req, res, next) => {
        try {
            await paymentService.verifyMomoWebhook(req.body)
            res.json({ message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

}

export default paymentController