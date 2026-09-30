import API from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  },

  trackOrder: async (orderId) => {
    const response = await API.get(`/orders/${orderId}/track`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await API.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Addresses
  getAddresses: async () => {
    const response = await API.get('/addresses');
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await API.post('/addresses', addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await API.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await API.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id) => {
    const response = await API.put(`/addresses/${id}/default`);
    return response.data;
  }
};
