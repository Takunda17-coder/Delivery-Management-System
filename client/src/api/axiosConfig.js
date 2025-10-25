import axios from "axios";

const api = axios.create({
  baseURL: "https://delivery-management-system-lbuv-o194birwp.vercel.app/api", // adjust backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
