import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosCustomize = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
});

axiosCustomize.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosCustomize;