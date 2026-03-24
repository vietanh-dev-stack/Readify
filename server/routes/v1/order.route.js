import express from 'express'
import orderController from '../../controllers/order.controller.js'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import orderValidation from '../../validations/order.validation.js'

const router = express.Router()

router.post(
    '/create',
    authMiddleware.isAuthorized,
    orderValidation.create,
    orderController.createOrder
)

router.get(
    '/',
    authMiddleware.isAuthorized,
    orderController.getOrder
)

router.get(
    '/update/:orderId',
    authMiddleware.isAuthorized,
    orderController.getOrderById
)

router.patch(
    '/delete/:orderId/cancel',
    authMiddleware.isAuthorized,
    orderController.cancelOrder
)

export default router