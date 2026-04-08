import axios from 'axios';
import { BASE_URL } from './config';
import { handleStorage } from './storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// interceptor

apiClient.interceptors.request.use(
  config => {
    const token = handleStorage('getAccessToken', 'accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  res => {
    return res;
  },
  async error => {
    if (error.response && error.response.status === 403) {
      const refreshToken = handleStorage('getRefreshToken', 'refreshToken');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await apiClient.post('/user/refresh', {
          refreshToken,
        });
        handleStorage('setAccessToken', data.accessToken, 'accessToken');
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
