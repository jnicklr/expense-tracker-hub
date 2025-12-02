import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

import { createBankAccount } from "../../services/bankAccountService";
import { createBankAccountSchema } from "../../schemas/bankAccountSchema";

interface CreateBankAccountInlineProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

export function CreateBankAccountInline({
  open,
  onClose,
  reload,
}: CreateBankAccountInlineProps) {
  const [form, setForm] = useState({
    name: "",
    number: "",
    agency: "",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    const parsed = createBankAccountSchema.safeParse(form);

    if (!parsed.success) {
      alert("Dados inválidos");
      return;
    }

    await createBankAccount({ ...form, userId: 1 });
    reload();
    onClose();
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 3,
        width: "100%",
        maxWidth: "100%",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)", 
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        sx={{ color: "#3b0a75" }}
      >
        Adicionar Nova Conta
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
        gap={3}
        mb={3}
      >
        <Box>
            <Typography fontWeight={600} mb={1}>
                Nome do Banco
            </Typography>
            <TextField
            label="Nome do Banco"
            placeholder="ex: Nubank"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            />
        </Box>
        <Box>
            <Typography fontWeight={600} mb={1}>
                Número
            </Typography>
            <TextField
            label="Número"
            placeholder="ex: 12345678-0"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            fullWidth
            />
        </Box>
        <Box>
            <Typography fontWeight={600} mb={1}>
                Agência
            </Typography>
            <TextField
            label="Agência"
            placeholder="ex: 0001"
            value={form.agency}
            onChange={(e) => setForm({ ...form, agency: e.target.value })}
            fullWidth
            />
        </Box>
      </Box>

      {/* Botões alinhados à direita */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            px: 2,
            borderRadius: 2,
            textTransform: "none"
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            px: 2,
            borderRadius: 2,
            backgroundColor: "#3b0a75",
            textTransform: "none",
            ":hover": { backgroundColor: "#3b0a75" },
          }}
        >
          Salvar Conta
        </Button>
      </Box>
    </Paper>
  );
}
