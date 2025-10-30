import axios from "axios";

const api = axios.create({
  baseURL: "https://delivery-management-system-backend-2385.onrender.com/api", // adjust backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
