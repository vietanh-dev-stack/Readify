import express from 'express'
import orderController from '../../controllers/order.controller.js'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import orderValidation from '../../validations/order.validation.js'

const router = express.Router()

router.post(
    '/',
    authMiddleware.isAuthorized,
    orderValidation.create,
    orderController.createOrder
)

router.get(
    '/admin',
    authMiddleware.isAuthorized,
    orderController.getOrdersForAdmin
)

router.get(
    '/',
    authMiddleware.isAuthorized,
    orderController.getOrder
)

router.get(
    '/admin/:orderId',
    authMiddleware.isAuthorized,
    orderController.getOrderDetailForAdmin
)

router.get(
    '/:orderId',
    authMiddleware.isAuthorized,
    orderController.getOrderById
)

router.patch(
    '/admin/:orderId/status',
    authMiddleware.isAuthorized,
    orderController.updateOrderStatusByAdmin
)

router.patch(
    '/:orderId/cancel',
    authMiddleware.isAuthorized,
    orderController.cancelOrder
)

export default router
