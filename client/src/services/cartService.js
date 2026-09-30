import API from './api';

export const cartService = {
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1, size = '') => {
    const response = await API.post('/cart', { productId, quantity, size });
    return response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await API.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await API.delete(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await API.delete('/cart');
    return response.data;
  },

  syncCart: async (items) => {
    const response = await API.post('/cart/sync', { items });
    return response.data;
  }
};
