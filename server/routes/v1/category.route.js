import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import categoryValidation from '../../validations/category.validation.js'
import categoryController from '../../controllers/category.controller.js'


const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, categoryValidation.create, categoryController.createCategory)
router.get('/', categoryController.getCategory)
router.put('/update/:cateId', authMiddleware.isAuthorized, categoryValidation.update, categoryController.updateCategory)
router.delete('/delete/:cateId', authMiddleware.isAuthorized, categoryController.deleteCategory)

export default router