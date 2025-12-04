/**
 * Configuração centralizada da API
 * Suporta múltiplos ambientes (dev, produção, etc)
 */

export const getApiUrl = (): string => {
  // Se houver variável de ambiente, usar
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Em produção, usar URL relativa (mesmo domínio)
  if (import.meta.env.PROD) {
    return "";
  }

  // Em desenvolvimento, usar localhost
  return "http://localhost:3000/api";
};

export const API_BASE_URL = getApiUrl();

// URLs dos endpoints
export const API_ENDPOINTS = {
  USER: `/user`,
  BANKACCOUNT: `${API_BASE_URL}/bank-account`,
  TRANSACTION: `${API_BASE_URL}/transaction`,
  CATEGORY: `${API_BASE_URL}/category`,
  AUTH_LOGIN: `/auth/login`,
  AUTH_REFRESH: `/auth/refresh`,
  AUTH_LOGOUT: `/auth/logout`,
  AUTH_PROFILE: `/auth/profile`,
};