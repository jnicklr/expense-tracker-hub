import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export const updateUserSchema = createUserSchema.extend({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export const userIdSchema = z.object({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserIdData = z.infer<typeof userIdSchema>;