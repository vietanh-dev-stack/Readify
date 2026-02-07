import express from 'express'
import authMiddleware from '../../middlewares/authMiddlewares.js'
import publisherValidation from '../../validations/publisher.validation.js'
import publisherController from '../../controllers/publisher.controller.js'


const router = express.Router()

router.post('/create', authMiddleware.isAuthorized, publisherValidation.create, publisherController.createPublisher)
router.get('/', publisherController.getPublisher)
router.put('/update/:puId', authMiddleware.isAuthorized, publisherValidation.update, publisherController.updatePublisher)
router.delete('/delete/:puId', authMiddleware.isAuthorized, publisherController.deletePublisher)


export default router