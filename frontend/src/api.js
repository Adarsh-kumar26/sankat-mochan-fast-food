import axios from "axios";

// In dev, Vite proxies "/api" to the local backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend's URL.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tff_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
