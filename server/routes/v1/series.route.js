import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import seriesValidation from '../../validations/series.validation.js'
import seriesController from '../../controllers/series.controller.js'

const router = express.Router()

router.post('/', authMiddleware.isAuthorized, seriesValidation.create, seriesController.createSeries)
router.get('/', seriesController.getSeries)
router.put('/:seId', authMiddleware.isAuthorized, seriesValidation.update, seriesController.updateSeries)
router.delete('/:seId', authMiddleware.isAuthorized, seriesController.deleteSeries)


export default router