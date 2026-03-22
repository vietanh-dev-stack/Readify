import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import addressValidation from '../../validations/address.validation.js'
import addressController from '../../controllers/address.controller.js'

const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, addressValidation.create, addressController.createAddress)
router.get('/', authMiddleware.isAuthorized, addressController.getAddress)
router.put('/update/:id', authMiddleware.isAuthorized, addressValidation.update, addressController.updateAddress)
router.delete('/delete/:id', authMiddleware.isAuthorized, addressController.deleteAddress)

export default router   