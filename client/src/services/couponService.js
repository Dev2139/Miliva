import API from './api';

export const couponService = {
  validateCoupon: async (code, cartTotal) => {
    const response = await API.post('/coupons/validate', { code, cartTotal });
    return response.data;
  },

  getCoupons: async () => {
    const response = await API.get('/coupons');
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await API.post('/coupons', couponData);
    return response.data;
  },

  updateCoupon: async (id, couponData) => {
    const response = await API.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await API.delete(`/coupons/${id}`);
    return response.data;
  }
};
