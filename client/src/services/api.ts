import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Se der 401 por token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      // Evita múltiplas requisições de refresh ao mesmo tempo
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        // Faz a requisição de refresh token
        const response = await api.post(API_ENDPOINTS.AUTH_REFRESH, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        // Atualiza headers da requisição original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Reprocessa as requisições que ficaram na fila
        failedRequestsQueue.forEach((req) => req.resolve(newAccessToken));
        failedRequestsQueue = [];

        return api(originalRequest);

      } catch (refreshError) {
        failedRequestsQueue.forEach((req) => req.reject(refreshError));
        failedRequestsQueue = [];

        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
