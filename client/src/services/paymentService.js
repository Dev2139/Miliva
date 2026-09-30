import API from './api';

export const paymentService = {
  createPaymentOrder: async (orderId) => {
    const response = await API.post('/payments/create-order', { orderId });
    return response.data;
  },

  verifyPayment: async (paymentDetails) => {
    const response = await API.post('/payments/verify', paymentDetails);
    return response.data;
  }
};
