import express from 'express';
import shipmentController from '../../controllers/shipment.controller.js';
import authMiddleware from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/order/:orderId', authMiddleware.isAuthorized, shipmentController.getShipmentInfo);

router.post('/order/:orderId', authMiddleware.isAuthorized, shipmentController.createShipment);

router.put('/order/:orderId/event', authMiddleware.isAuthorized, shipmentController.addTrackingEvent);

export default router;
