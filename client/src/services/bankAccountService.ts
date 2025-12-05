import { api } from "./api";
import type { CreateBankAccountFormData } from "../schemas/bankAccountSchema";
import type { BankAccount } from "../types/bank-account";

export const createBankAccount = async (dados: CreateBankAccountFormData): Promise<BankAccount> => {
  const response = await api.post("/bank-account", dados);
  return response.data;
};

export const updateBankAccount = async (id: number, dados: Partial<CreateBankAccountFormData>): Promise<BankAccount> => {
  const response = await api.patch(`/bank-account/${id}`, dados);
  return response.data;
};

export const getBankAccount = async (): Promise<BankAccount[]> => {
  const response = await api.get("/bank-account");
  return response.data;
};

export const getBankAccounts = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/bank-account", { params: { page, limit, search } });
  return response.data;
};

export const deleteBankAccount = async (id: number) => {
  return await api.delete(`/bank-account/${id}`);
};
