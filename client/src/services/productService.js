import API from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await API.get(`/products/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await API.get(`/products/${productId}/reviews`);
    return response.data;
  },

  addReview: async (productId, reviewData) => {
    const response = await API.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  checkPincode: async (pincode) => {
    const response = await API.get(`/pincode/${pincode}`);
    return response.data;
  }
};
