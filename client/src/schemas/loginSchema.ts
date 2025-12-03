import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }).min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.email({ message: "Email inválido" }).min(1, "Email é obrigatório"),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export const createUserSchema = registerSchema.omit({
  confirmPassword: true,
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
