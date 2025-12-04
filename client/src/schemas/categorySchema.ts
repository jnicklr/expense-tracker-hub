import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Nome da categoria é obrigatório" }),
  description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export const categoryIdSchema = z.object({
  id: z.number().int().positive({ message: "ID inválido" }),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CategoryIdData = z.infer<typeof categoryIdSchema>;
