import axiosCustomize from '../api/axiosCustomize';

export const createPayment = (orderId) => {
  return axiosCustomize.post(`/payment/${orderId}`);
};