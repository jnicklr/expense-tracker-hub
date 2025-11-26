import type { User } from "./user";
import type { Transaction } from "./transaction";

export interface BankAccount {
  id: number;
  userId: number;
  name: string;
  number: string;
  agency: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  transactions: Transaction[];
}
