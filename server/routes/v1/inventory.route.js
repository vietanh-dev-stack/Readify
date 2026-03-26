import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import inventoryValidation from '../../validations/inventory.validation.js'
import inventoryController from '../../controllers/inventory.controller.js'


const router = express.Router()

router.post('/', authMiddleware.isAuthorized, inventoryValidation.create, inventoryController.createInventory)
router.get('/', inventoryController.getInventory)
router.put('/:invenId', authMiddleware.isAuthorized, inventoryValidation.update, inventoryController.updateInventory)

export default router