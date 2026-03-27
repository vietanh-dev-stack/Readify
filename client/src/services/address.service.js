import axiosCustomize from '../api/axiosCustomize';

export const getAddresses = () => {
  return axiosCustomize.get('/address');
};

export const createAddress = (payload) => {
  return axiosCustomize.post('/address', payload);
};