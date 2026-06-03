import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const register = async (userData) => {
  const response = await api.post('/register/', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/login/', credentials);
  return response.data;
};

export default api;
