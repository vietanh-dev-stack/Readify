import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import bookValidation from '../../validations/book.validation.js'
import bookController from '../../controllers/book.controller.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'


const router = express.Router()

router.post('/', authMiddleware.isAuthorized, uploadMiddleware.uploadBookImages, bookController.createBook)
router.get('/', bookController.getBook)
router.put('/:bId', authMiddleware.isAuthorized, uploadMiddleware.uploadBookImages, bookValidation.update, bookController.updateBook)
router.delete('/:bId', authMiddleware.isAuthorized, bookController.deleteBook)
router.get('/:bId', bookController.getBookById)
router.get('/quantity/:bId', bookController.getQuantityByBook)

export default router