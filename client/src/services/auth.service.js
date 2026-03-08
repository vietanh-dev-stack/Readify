import axiosCustomize from '../api/axiosCustomize';

const authService = {
  login: async (email, password) => {
    return axiosCustomize.post('/auth/login', { email, password });
  },
  register: async (username, email, password, confirmPassword) => {
    return axiosCustomize.post('/auth/register', { username, email, password, confirmPassword });
  }
};

export default authService;
