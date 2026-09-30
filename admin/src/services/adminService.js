import API from './api';

export const adminService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('miliva_admin_token', res.data.token);
      localStorage.setItem('miliva_admin_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await API.get('/admin/dashboard');
    return res.data;
  },

  getCustomers: async () => {
    const res = await API.get('/admin/customers');
    return res.data;
  },

  toggleUserStatus: async (userId) => {
    const res = await API.put(`/admin/customers/${userId}/toggle`);
    return res.data;
  },

  getInventory: async () => {
    const res = await API.get('/admin/inventory');
    return res.data;
  },

  getProducts: async (params = {}) => {
    const res = await API.get('/products', { params: { ...params, limit: 100 } });
    return res.data;
  },

  createProduct: async (data) => {
    const res = await API.post('/products', data);
    return res.data;
  },

  updateProduct: async (id, data) => {
    const res = await API.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await API.get('/categories');
    return res.data;
  },

  getOrders: async () => {
    const res = await API.get('/orders');
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await API.get(`/orders/${id}`);
    return res.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const res = await API.put(`/orders/${id}/status`, statusData);
    return res.data;
  },

  getBundles: async () => {
    const res = await API.get('/bundles');
    return res.data;
  },

  createBundle: async (data) => {
    const res = await API.post('/bundles', data);
    return res.data;
  },

  updateBundle: async (id, data) => {
    const res = await API.put(`/bundles/${id}`, data);
    return res.data;
  },

  deleteBundle: async (id) => {
    const res = await API.delete(`/bundles/${id}`);
    return res.data;
  },

  getCoupons: async () => {
    const res = await API.get('/coupons');
    return res.data;
  },

  createCoupon: async (data) => {
    const res = await API.post('/coupons', data);
    return res.data;
  },

  deleteCoupon: async (id) => {
    const res = await API.delete(`/coupons/${id}`);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('miliva_admin_token');
    localStorage.removeItem('miliva_admin_user');
  }
};
