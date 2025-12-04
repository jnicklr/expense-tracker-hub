import { useState, useCallback } from "react";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";
import { jwtDecode } from "jwt-decode";

import { createCategory } from "../../services/categoryService";
import { z } from "zod";

// Schema atualizado para incluir userId
export const createCategorySchemaWithUser = z.object({
  userId: z.number().int().positive({ message: "ID do usuário é obrigatório" }),
  name: z.string().min(1, { message: "Nome da categoria é obrigatório" }),
  description: z.string().optional(),
});

interface CreateCategoryInlineProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

interface CategoryForm {
  name: string;
  description?: string;
}

export function CreateCategoryInline({ open, onClose, reload }: CreateCategoryInlineProps) {
  const [form, setForm] = useState<CategoryForm>({ name: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgSuccess, setMsgSuccess] = useState("");

  if (!open) return null;

  const handleSubmit = useCallback(async () => {
    setErrors({});
    setMsgSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Você não está autenticado!");
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub; // pega o ID do usuário do token
      if (!userId) throw new Error("ID do usuário não encontrado!");

      // Valida os dados com Zod
      const parsed = createCategorySchemaWithUser.parse({ ...form, userId });

      // Chama o serviço de criação
      await createCategory(parsed);

      setMsgSuccess("Categoria criada com sucesso!");
      reload();
      onClose();
    } catch (err: any) {
      if (err?.issues) {
        // erros de validação do Zod
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue: any) => {
          if (issue.path.length > 0) fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (err.response?.data?.message) {
        // mensagens do backend
        alert(err.response.data.message);
      } else {
        alert(err.message || "Erro ao criar categoria");
      }
    }
  }, [form, reload, onClose]);

  return (
    <Paper sx={{ p: 4, mb: 5, borderRadius: 3, width: "100%", maxWidth: "100%", boxShadow: "0px 1px 5px rgba(0,0,0,0.1)" }}>
      <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: "#3b0a75" }}>
        Criar Nova Categoria
      </Typography>

      {msgSuccess && <Alert severity="success" sx={{ mb: 2 }}>{msgSuccess}</Alert>}

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
        <TextField
          label="Nome"
          placeholder="ex: Alimentação"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Descrição"
          placeholder="ex: Gastos com comida"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#3b0a75", ":hover": { backgroundColor: "#3b0a75" } }}>
          Salvar Categoria
        </Button>
      </Box>
    </Paper>
  );
}

