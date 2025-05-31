// axiosInstance.js
import axios from 'axios';
import { Navigate } from 'react-router-dom';
const api = axios.create({
  baseURL: 'http://localhost:5231/api',
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshTokenFromCookie();

      if (!refreshToken) {
        window.location.href = '/login/signin';
        return Promise.reject(error);
      }

      try {
        const res = await api.post('/auth/refresh', { refreshToken });

        return api(originalRequest); 
      } catch (refreshError) {
        window.location.href = '/login/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


function getRefreshTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; refreshToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default api;
