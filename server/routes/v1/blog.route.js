import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import cloudinaryProvider from '../../providers/cloudinaryProvider.js'
import blogController from '../../controllers/blog.controller.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'
import blogValidation from '../../validations/blog.validation.js'

const router = express.Router()

router.post('/', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), blogValidation.create, blogController.createBlog)
router.get('/', blogController.getBlog)
router.get('/admin', authMiddleware.isAuthorized, blogController.getBlogAdmin)
router.put('/:bid', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), blogController.updateBlog)
router.delete('/:bid', authMiddleware.isAuthorized, blogController.deleteBlog)
router.get('/:bid', blogController.getBlogById)

export default router