// src/services/bankAccountService.ts
import type { BankAccount } from "../types/bank-account";
import { http } from "./http";
import type { CreateBankAccountFormData } from "../schemas/bankAccountSchema";

export const createBankAccount = async (dados: CreateBankAccountFormData): Promise<BankAccount> => {
  const response = await http.post("/bank-account", dados);
  return response.data;
};

export const updateBankAccount = async (id: number, dados: Partial<BankAccount>): Promise<BankAccount> => {
  const response = await http.put(`/bank-account/${id}`, dados);
  return response.data;
};

export const getBankAccount = async (): Promise<BankAccount[]> => {
  const response = await http.get("/bank-account");
  return response.data;
};

export const deleteBankAccount = async (id: number): Promise<void> => {
  await http.delete(`/bank-account/${id}`);
};

