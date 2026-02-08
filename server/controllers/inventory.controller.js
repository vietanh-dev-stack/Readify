import { StatusCodes } from "http-status-codes"
import inventoryService from '../services/inventory.service.js'


const inventoryController = {

    createInventory: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await inventoryService.createInventory(userId, req.body)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getInventory: async (req, res, next) => {
        try {
            const result = await inventoryService.getInventory()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateInventory: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const invenId = req.params.invenId
            const result = await inventoryService.updateInventory(invenId, userId, req.body)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}


export default inventoryController