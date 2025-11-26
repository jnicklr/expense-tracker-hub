import axios from "axios";
import type { User } from "../types/user";
import { API_ENDPOINTS } from "../config/api";


export const createUser = async (dados: Omit<User, "id">): Promise<User> => {
  const response = await axios.post(API_ENDPOINTS.USER, dados, {});
  return response.data;
};

export const updateUser = async (id: number, dados: Partial<User>): Promise<User> => {
  const response = await axios.put(`${API_ENDPOINTS.USER}/${id}`, dados, {});
  return response.data;
};

export const getUser = async (): Promise<User[]> => {
  const response = await axios.get(API_ENDPOINTS.USER);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.USER}/${id}`);
};


