import axios from "axios";

// Backend'in adresi - tek yerden yönetiliyor
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Her istekte, eğer token varsa otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;