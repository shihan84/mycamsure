import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  createServiceRequest: async (data: any) => {
    const response = await api.post('/service-request', data);
    return response.data;
  },
  
  getServiceRequest: async (id: string) => {
    const response = await api.get(`/service-request/${id}`);
    return response.data;
  },
  
  listServiceRequests: async () => {
    const response = await api.get('/service-request');
    return response.data;
  },
};

// Direct exports for easier importing
export const createServiceRequest = apiService.createServiceRequest;
export const getServiceRequest = apiService.getServiceRequest;
export const listServiceRequests = apiService.listServiceRequests;

export default api;
