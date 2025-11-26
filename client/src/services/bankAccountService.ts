import axios from "axios";
import type { BankAccount } from "../types/bank-account";
import { API_ENDPOINTS } from "../config/api";


export const createBankAccount = async (dados: Omit<BankAccount, "id">): Promise<BankAccount> => {
  const response = await axios.post(API_ENDPOINTS.BANKACCOUNT, dados, {});
  return response.data;
};

export const updateBankAccount = async (id: number, dados: Partial<BankAccount>): Promise<BankAccount> => {
  const response = await axios.put(`${API_ENDPOINTS.BANKACCOUNT}/${id}`, dados, {});
  return response.data;
};

export const getBankAccount = async (): Promise<BankAccount[]> => {
  const response = await axios.get(API_ENDPOINTS.BANKACCOUNT);
  return response.data;
};

export const deleteBankAccount = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.BANKACCOUNT}/${id}`);
};


