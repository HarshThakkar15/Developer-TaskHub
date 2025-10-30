// frontend/src/api/api.js
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, err => Promise.reject(err));

api.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    removeToken();
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export default api;