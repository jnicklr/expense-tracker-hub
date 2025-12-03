import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import type { LoginSchema, RegisterSchema } from "../schemas/loginSchema";

export const signIn = async (dados: LoginSchema) => {
  const response = await axios.post(API_ENDPOINTS.AUTH_LOGIN, dados);
  return response.data;
};

export const signUp = async (dados: Omit<RegisterSchema, "confirmPassword">) => {
  const response = await axios.post(API_ENDPOINTS.USER, dados);
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(API_ENDPOINTS.AUTH_REFRESH, {
    refresh_token: token,
  });

  return response.data;
};

export const logout = async (token: string) => {
  const response = await axios.post(API_ENDPOINTS.AUTH_LOGOUT, {
    refresh_token: token,
  });
  return response.data;
};
