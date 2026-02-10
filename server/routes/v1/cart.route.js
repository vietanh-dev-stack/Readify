import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import cartValidation from '../../validations/cart.validation.js'
import cartController from '../../controllers/cart.controller.js'

const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, cartValidation.create, cartController.createCart)
router.get('/', authMiddleware.isAuthorized, cartController.getCart)
router.put('/update/:cId', authMiddleware.isAuthorized, cartController.updateCart)
router.delete('/delete/:bookId', authMiddleware.isAuthorized, cartController.deleteCart)

export default router