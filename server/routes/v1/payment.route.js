import express from 'express'
import paymentController from '../../controllers/payment.controller.js'
import authMiddleware from '../../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/:orderId', authMiddleware.isAuthorized, paymentController.createPayment)

router.get('/vnpay-return', paymentController.vnpayReturn)

router.post('/momo-webhook', paymentController.momoWebhook)

export default router