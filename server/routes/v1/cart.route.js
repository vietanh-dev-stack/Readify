import express from 'express'
import cartController from '../../controllers/cart.controller.js'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import cartValidation from '../../validations/cart.validation.js'


const router = express.Router()

router.post('/add-to-cart', authMiddleware.isAuthorized, cartValidation.create, cartController.addToCart)
router.get('/', authMiddleware.isAuthorized, cartController.getCart)
router.put('/:bookId', authMiddleware.isAuthorized, cartValidation.update, cartController.updateCartItem)
router.delete('/:bookId', authMiddleware.isAuthorized, cartController.removeCartItem)

export default router