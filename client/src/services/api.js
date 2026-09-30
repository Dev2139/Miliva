import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('miliva_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('miliva_token')) {
        localStorage.removeItem('miliva_token');
        localStorage.removeItem('miliva_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
