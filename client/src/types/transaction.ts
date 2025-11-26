import type {BankAccount} from "./bank-account";
import type { Category } from "./category";
import { TransactionType } from "./transaction-type";

export interface Transaction {
  id: number;
  bankAccountId: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  description?: string;
  isEssential: boolean;
  transactionAt: Date;
  createdAt: Date;
  updatedAt: Date;
  bankAccount: BankAccount;
  category: Category;
}
