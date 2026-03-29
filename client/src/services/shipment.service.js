import axiosCustomize from '../api/axiosCustomize';


export const getShipmentByOrderId = (orderId) => {
  return axiosCustomize.get(`/shipment/order/${orderId}`);
};


export const createShipment = (orderId, shipmentData) => {
  return axiosCustomize.post(`/shipment/order/${orderId}`, shipmentData);
};


export const updateTrackingEvent = (orderId, eventData) => {
  return axiosCustomize.put(`/shipment/order/${orderId}/event`, eventData);
};
