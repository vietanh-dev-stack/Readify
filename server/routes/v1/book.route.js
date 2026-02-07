import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import bookValidation from '../../validations/book.validation.js'
import bookController from '../../controllers/book.controller.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'

const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, uploadMiddleware.uploadBookImages, bookController.createBook)
router.get('/', bookController.getBook)
router.put('/update/:bId', authMiddleware.isAuthorized, uploadMiddleware.uploadBookImages, bookValidation.update, bookController.updateBook)
router.delete('/delete/:bId', authMiddleware.isAuthorized, bookController.deleteBook)
router.get('/:bId', bookController.getBookById)

export default router