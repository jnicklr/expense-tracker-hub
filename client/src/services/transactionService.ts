import { api } from "./api";
import type { Transaction } from "../types/transaction";
import type { CreateTransactionFormData } from "../schemas/transactionSchema";

export const createTransaction = async (dados: CreateTransactionFormData): Promise<Transaction> => {
  const response = await api.post("/transaction", dados);
  return response.data;
};

export const updateTransaction = async (id: number, dados: Partial<CreateTransactionFormData>): Promise<Transaction> => {
  const response = await api.patch(`/transaction/${id}`, dados);
  return response.data;
};

export const getTransaction = async (): Promise<Transaction[]> => {
  const response = await api.get("/transaction");
  return response.data;
};

export const getTransactions = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/transaction", { params: { page, limit, search } });
  return response.data;
};

export const deleteTransaction = async (id: number) => {
  return await api.delete(`/transaction/${id}`);
};
