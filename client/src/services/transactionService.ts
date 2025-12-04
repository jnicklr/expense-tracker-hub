import type { Transaction } from "../types/transaction";
import type { CreateTransactionFormData } from "../schemas/transactionSchema";
import { http } from "./http"; // <-- USANDO O MESMO CLIENT HTTP DO PROJETO

export const createTransaction = async (
  dados: CreateTransactionFormData
): Promise<Transaction> => {
  const response = await http.post("/transaction", dados);
  return response.data;
};

export const updateTransaction = async (
  id: number,
  dados: Partial<Transaction>
): Promise<Transaction> => {
  const response = await http.put(`/transaction/${id}`, dados);
  return response.data;
};

export const getTransaction = async (): Promise<Transaction[]> => {
  const response = await http.get("/transaction");
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await http.delete(`/transaction/${id}`);
};
