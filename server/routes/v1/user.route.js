import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import userController from '../../controllers/user.controller.js'
import userValidation from '../../validations/user.validation.js'
import uploadMiddleware from '../../middlewares/uploadMiddleware.js'

const router = express.Router()


router.put('/update-profile', authMiddleware.isAuthorized, uploadMiddleware.upload.single('image'), userValidation.updateProfile, userController.updateProfile)


export default router