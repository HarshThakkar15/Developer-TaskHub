import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const API_BASE = process.env.REACT_APP_API_URL + '/api' || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE});


api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;