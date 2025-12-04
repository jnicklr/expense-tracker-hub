import axios from "axios";
import type { User } from "../types/user";
import { API_ENDPOINTS } from "../config/api";
import { api } from "./api";


export const createUser = async (dados: Omit<User, "id">): Promise<User> => {
  const response = await axios.post(API_ENDPOINTS.USER, dados, {});
  return response.data;
};

export const updateProfileInfo = async (dados: Partial<User>): Promise<User> => {
  const response = await api.patch(API_ENDPOINTS.USER, dados, {});
  return response.data;
};

export const getProfileInfo = async (): Promise<User> => {
  const response = await api.get(API_ENDPOINTS.AUTH_PROFILE);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.USER}/${id}`);
};


