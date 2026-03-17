import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  timeout: 15000, // 15s timeout
});

// Cache the token in memory — avoid reading localStorage on every request
let _token = localStorage.getItem("token");

// Update cached token when it changes
export const setToken = (token) => { _token = token; };
export const clearToken = () => { _token = null; };

API.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      _token = null;
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default API;