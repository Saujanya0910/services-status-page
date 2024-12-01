import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN, // Ensure this is correctly set
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;