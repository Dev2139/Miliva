import API from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await API.get('/admin/dashboard');
    return response.data;
  },

  getCustomers: async () => {
    const response = await API.get('/admin/customers');
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await API.put(`/admin/customers/${userId}/toggle`);
    return response.data;
  },

  getInventory: async () => {
    const response = await API.get('/admin/inventory');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await API.put(`/orders/${id}/status`, statusData);
    return response.data;
  }
};
