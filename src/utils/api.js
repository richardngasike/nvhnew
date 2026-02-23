import axios from 'axios';

// Use environment variable for backend URL (Render)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Request interceptor: add auth token if exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nhv_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nhv_token');
        localStorage.removeItem('nhv_landlord');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (formData) =>
    api.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  activate: (id) => api.post(`/listings/${id}/activate`),
  delete: (id) => api.delete(`/listings/${id}`),
  addReview: (id, data) => api.post(`/listings/${id}/reviews`, data),
  inquire: (id, data) => api.post(`/listings/${id}/inquire`, data),
  getStats: () => api.get('/listings/stats/overview'),
  checkPayment: (checkoutId) => api.get(`/listings/payment/status/${checkoutId}`),
};

// Landlord API
export const landlordAPI = {
  register: (data) => api.post('/landlords/register', data),
  login: (data) => api.post('/landlords/login', data),
  getProfile: () => api.get('/landlords/profile'),
  getListings: () => api.get('/landlords/listings'),
  updateProfile: (data) => api.put('/landlords/profile', data),
};

export default api;