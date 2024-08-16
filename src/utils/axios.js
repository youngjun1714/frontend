import axios from 'axios';
import tokenStore from './token-store';

let axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = tokenStore.get('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
