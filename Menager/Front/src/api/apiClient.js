// src/api/apiClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5231/api',
  withCredentials: true,   // send + receive your HttpOnly JWT cookies
});

api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;
    // on 401, try a single refresh + retry
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      await api.post('/auth/refresh');
      return api(orig);
    }
    return Promise.reject(err);
  }
);

export default api;
