import axiosCustomize from '../api/axiosCustomize';

const authService = {
  login: async (email, password) => {
    return axiosCustomize.post('/auth/login', { email, password });
  },
  googleLogin: async (token) => {
    return axiosCustomize.post('/auth/google', { token })
  },
  register: async (username, email, password, confirmPassword) => {
    return axiosCustomize.post('/auth/register', { username, email, password, confirmPassword });
  }
};

export default authService;
