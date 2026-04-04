import axiosCustomize from '../api/axiosCustomize';

export const getAddresses = () => {
  return axiosCustomize.get('/address');
};

export const createAddress = (payload) => {
  return axiosCustomize.post('/address', payload);
};

export const updateAddress = (id, payload) => {
  return axiosCustomize.put(`/address/${id}`, payload);
};

export const deleteAddress = (id) => {
  return axiosCustomize.delete(`/address/${id}`);
};