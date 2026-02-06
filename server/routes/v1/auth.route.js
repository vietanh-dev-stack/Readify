import express from 'express'
import authController from '../../controllers/auth.controller.js'
import authValidation from '../../validations/auth.validation.js'

const router = express.Router()

router.post('/login', authValidation.login, authController.login)
router.post('/register', authValidation.register, authController.register)

export default router
