import useStore from '@/store';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// handle 503 & 504 errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if ([503, 504].includes(error.response?.status)) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        await new Promise(resolve => setTimeout(resolve, 3000));
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// request interceptor logic to attach the user id to the request headers
axiosInstance.interceptors.request.use(
  config => {
    const store = useStore.getState();
    if (store.currentUser) {
      config.headers['X-User-Id'] = store.currentUser.uuid;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;