import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import authorValidation from '../../validations/author.validation.js'
import authorController from '../../controllers/author.controller.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'

const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), authorValidation.create, authorController.createAuthor)
router.get('/', authorController.getAuthor)
router.put('/update/:aId', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), authorController.updateAuthor)
router.delete('/delete/:aId', authMiddleware.isAuthorized, authorController.deleteAuthor)


export default router