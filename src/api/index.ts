import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.0.150:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

export default api;
