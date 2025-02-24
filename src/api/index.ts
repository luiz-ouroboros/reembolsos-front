import axios from 'axios';

const api_url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: api_url,
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
