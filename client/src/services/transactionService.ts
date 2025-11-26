import axios from "axios";
import type { Transaction } from "../types/transaction";
import { API_ENDPOINTS } from "../config/api";


export const createTransaction = async (dados: Omit<Transaction, "id">): Promise<Transaction> => {
  const response = await axios.post(API_ENDPOINTS.TRANSACTION, dados, {});
  return response.data;
};

export const updateTransaction = async (id: number, dados: Partial<Transaction>): Promise<Transaction> => {
  const response = await axios.put(`${API_ENDPOINTS.TRANSACTION}/${id}`, dados, {});
  return response.data;
};

export const getTransaction = async (): Promise<Transaction[]> => {
  const response = await axios.get(API_ENDPOINTS.TRANSACTION);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.TRANSACTION}/${id}`);
};


