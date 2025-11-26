import type { User } from "./user";
import type { Transaction } from "./transaction";

export interface Category {
  id: number;
  userId: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  transactions: Transaction[];
}
