import axios from "axios";
import type { Category } from "../types/category";
import { API_ENDPOINTS } from "../config/api";


export const createBankAccount = async (dados: Omit<Category, "id">): Promise<Category> => {
  const response = await axios.post(API_ENDPOINTS.CATEGORY, dados, {});
  return response.data;
};

export const updateCategory = async (id: number, dados: Partial<Category>): Promise<Category> => {
  const response = await axios.put(`${API_ENDPOINTS.CATEGORY}/${id}`, dados, {});
  return response.data;
};

export const getCategory = async (): Promise<Category[]> => {
  const response = await axios.get(API_ENDPOINTS.CATEGORY);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.CATEGORY}/${id}`);
};


