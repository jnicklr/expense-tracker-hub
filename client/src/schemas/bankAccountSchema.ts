import { z } from "zod";

export const createBankAccountSchema = z.object({
  name: z.string().min(1, { message: "Nome da conta é obrigatório" }),
  number: z.string().min(1, { message: "Número da conta é obrigatório" }),
  agency: z.string().min(1, { message: "Agência é obrigatória" }),
});

export const updateBankAccountSchema = createBankAccountSchema.extend({
  id: z.number().int().positive({ message: "ID inválido" }),
});

// Schema opcional para deletar ou buscar por ID 
export const bankAccountIdSchema = z.object({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export type CreateBankAccountFormData = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccountFormData = z.infer<typeof updateBankAccountSchema>;
export type BankAccountIdData = z.infer<typeof bankAccountIdSchema>;
