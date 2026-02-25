import axios from "axios";
import { normalizeApiError } from "./error";
import { clearSession } from "./session";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error?.response?.status;
    if (statusCode === 401) {
      clearSession();
    }
    return Promise.reject(normalizeApiError(error));
  }
);

export default api;
