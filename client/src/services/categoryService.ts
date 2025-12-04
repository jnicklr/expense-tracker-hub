import { http } from "./http";
import type { CreateCategoryFormData } from "../schemas/categorySchema";
import type { Category } from "../types/category";

export const createCategory = async (dados: CreateCategoryFormData): Promise<Category> => {
  const response = await http.post("/category", dados);
  return response.data;
};

export const updateCategory = async (id: number, dados: Partial<CreateCategoryFormData>): Promise<Category> => {
  const response = await http.put(`/category/${id}`, dados);
  return response.data;
};

export const getCategory = async (): Promise<Category[]> => {
  const response = await http.get("/category");
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await http.delete(`/category/${id}`);
};
