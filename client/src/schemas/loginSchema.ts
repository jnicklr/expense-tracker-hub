import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }).min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),

  email: z.string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),

  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,}$/,
      "A senha deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo"
    ),

  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const createUserSchema = registerSchema.omit({
  confirmPassword: true,
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
