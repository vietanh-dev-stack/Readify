import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import authorValidation from '../../validations/author.validation.js'
import authorController from '../../controllers/author.controller.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), authorValidation.create, authorController.createAuthor)
router.get('/', authorController.getAuthor)
router.put('/:aId', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), authorController.updateAuthor)
router.delete('/:aId', authMiddleware.isAuthorized, authorController.deleteAuthor)
router.get('/:aId', authorController.getAuthorById)

export default router