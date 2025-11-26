import { z } from "zod";

// Enum de tipo de transação
export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createTransactionSchema = z.object({
  bankAccountId: z.number().int().positive({ message: "Conta bancária inválida" }),
  categoryId: z.number().int().positive({ message: "Categoria inválida" }),
  type: transactionTypeEnum,
  amount: z.number().positive({ message: "Valor deve ser positivo" }),
  description: z.string().optional(),
  isEssential: z.boolean().optional(),
  transactionAt: z.string().min(1, { message: "Data da transação obrigatória" }), // string ISO
});

export const updateTransactionSchema = createTransactionSchema.extend({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export const transactionIdSchema = z.object({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionFormData = z.infer<typeof updateTransactionSchema>;
export type TransactionIdData = z.infer<typeof transactionIdSchema>;