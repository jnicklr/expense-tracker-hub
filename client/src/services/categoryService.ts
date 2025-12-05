import { api } from "./api";
import type { CreateCategoryFormData } from "../schemas/categorySchema";
import type { Category } from "../types/category";

export const createCategory = async (dados: CreateCategoryFormData): Promise<Category> => {
  const response = await api.post("/category", dados);
  return response.data;
};

export const updateCategory = async (id: number, dados: Partial<CreateCategoryFormData>): Promise<Category> => {
  const response = await api.patch(`/category/${id}`, dados);
  return response.data;
};

export const getCategory = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export async function getCategories(page = 1, limit = 10, search = "") {
  const res = await api.get("/category", {
    params: { page, limit, search }
  });
  return res.data;
}

export const deleteCategory = async (id: number) => {
  return await api.delete(`/category/${id}`);
};
