import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import addressValidation from '../../validations/address.validation.js'
import addressController from '../../controllers/address.controller.js'

const router = express.Router()

router.post('/', authMiddleware.isAuthorized, addressValidation.create, addressController.createAddress)
router.get('/', authMiddleware.isAuthorized, addressController.getAddress)
router.put('/:id', authMiddleware.isAuthorized, addressValidation.update, addressController.updateAddress)
router.delete('/:id', authMiddleware.isAuthorized, addressController.deleteAddress)

export default router   