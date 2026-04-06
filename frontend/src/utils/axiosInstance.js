import axios from "axios";

// Dynamically set the base URL based on environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://interview-ace-ai-backend-r7k7.vercel.app";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60s timeout for AI generation and cold starts
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
