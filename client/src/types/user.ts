import type { BankAccount } from "./bank-account";
import type { Category } from "./category";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  bankAccount: BankAccount[];
  categories: Category[];
}