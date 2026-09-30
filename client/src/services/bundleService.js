import API from './api';

export const bundleService = {
  getBundles: async () => {
    const response = await API.get('/bundles');
    return response.data;
  },

  getBundleBySlug: async (slug) => {
    const response = await API.get(`/bundles/${slug}`);
    return response.data;
  },

  createBundle: async (data) => {
    const response = await API.post('/bundles', data);
    return response.data;
  },

  updateBundle: async (id, data) => {
    const response = await API.put(`/bundles/${id}`, data);
    return response.data;
  },

  deleteBundle: async (id) => {
    const response = await API.delete(`/bundles/${id}`);
    return response.data;
  }
};
