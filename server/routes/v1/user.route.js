import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import userController from '../../controllers/user.controller.js'
import userValidation from '../../validations/user.validation.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'

const router = express.Router()


router.put('/update-profile', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), userValidation.updateProfile, userController.updateProfile)
router.get('/get-user', authMiddleware.isAuthorized, userController.getUser)
router.post('/create-user', authMiddleware.isAuthorized, userValidation.createUser, userController.createUser)
router.patch('/update-role/:id', authMiddleware.isAuthorized, userController.updateRole)
router.patch('/update-status/:id', authMiddleware.isAuthorized, userController.updateStatus)

export default router