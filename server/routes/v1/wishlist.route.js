import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import wishlistValidation from '../../validations/wishlist.validation.js'
import wishlistController from '../../controllers/wishlist.controller.js'


const router = express.Router()

router.post('/', authMiddleware.isAuthorized, wishlistValidation.add, wishlistController.addToWishlist)
router.get('/', authMiddleware.isAuthorized, wishlistController.getWishlist)
router.delete('/:bookId', authMiddleware.isAuthorized, wishlistController.removeFromWishlist)

export default router