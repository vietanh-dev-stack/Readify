import axiosCustomize from '../api/axiosCustomize';

export const createOrder = (payload) => {
  return axiosCustomize.post('/order', payload);
};

export const getOrders = (params) => {
  return axiosCustomize.get('/order', { params });
};

export const getOrderById = (orderId) => {
  return axiosCustomize.get(`/order/${orderId}`);
};

export const cancelOrder = (orderId) => {
  return axiosCustomize.patch(`/order/${orderId}/cancel`);
};
