// src/lib/api.ts
import axios, {  AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

// token set on  every request
function handleRequest(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

// success handler
function handleSuccess(response: AxiosResponse): AxiosResponse {
  return response;
}

//  error handler
function handleError(error: AxiosError): Promise<never> {
  const status = error.response?.status;

  if (status === 401) {
    localStorage.removeItem("token");

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
}


api.interceptors.request.use(handleRequest);
api.interceptors.response.use(handleSuccess, handleError);

export default api;