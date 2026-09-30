import API from './api';

export const authService = {
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('miliva_token', response.data.token);
      localStorage.setItem('miliva_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('miliva_token', response.data.token);
      localStorage.setItem('miliva_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put('/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('miliva_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await API.post('/auth/reset-password', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('miliva_token');
    localStorage.removeItem('miliva_user');
  }
};
