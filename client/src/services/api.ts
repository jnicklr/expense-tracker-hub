// api.ts
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Cliente SEM interceptors para o refresh (ESSENCIAL!)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Se deu 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }

      // Se já existe refresh em andamento → coloca request na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // Usa NOUTRO axios, sem interceptors
        const response = await refreshClient.post(
          API_ENDPOINTS.AUTH_REFRESH,
          { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        // Reenvia request que falhou
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        failedRequestsQueue.forEach((req) => req.resolve(newAccessToken));
        failedRequestsQueue = [];

        return api(originalRequest);

      } catch (err) {
        failedRequestsQueue.forEach((req) => req.reject(err));
        failedRequestsQueue = [];

        localStorage.clear();
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
