import { useState, useCallback } from "react";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";

import { useAuth } from "../../hooks/useAuth";
import { createBankAccount } from "../../services/bankAccountService";
import { createBankAccountSchema } from "../../schemas/bankAccountSchema";

interface CreateBankAccountInlineProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

interface BankAccountForm {
  name: string;
  number: string;
  agency: string;
}

export function CreateBankAccountInline({
  open,
  onClose,
  reload,
}: CreateBankAccountInlineProps) {
  const [form, setForm] = useState<BankAccountForm>({
    name: "",
    number: "",
    agency: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgSuccess, setMsgSuccess] = useState("");

  const { user } = useAuth();

  if (!open) return null;

  const handleSubmit = useCallback(async () => {
    setErrors({});
    setMsgSuccess("");

    try {
      const parsed = createBankAccountSchema.parse(form);
      await createBankAccount(parsed);

      setMsgSuccess("Conta criada com sucesso!");

      reload();
      onClose();
    } catch (err: any) {
      if (err?.issues) {
        const fieldErrors: Record<string, string> = {};

        err.issues.forEach((issue: any) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0]] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        alert(err.message || "Erro ao criar conta");
      }
    }
  }, [form, reload, onClose]);

  return (
    <Paper
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 3,
        width: "100%",
        maxWidth: "100%",
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

      {msgSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msgSuccess}
        </Alert>
      )}

      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
        gap={3}
        mb={3}
      >
        <TextField
          label="Nome do Banco"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Número"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
          fullWidth
          error={!!errors.number}
          helperText={errors.number}
        />

        <TextField
          label="Agência"
          value={form.agency}
          onChange={(e) => setForm({ ...form, agency: e.target.value })}
          fullWidth
          error={!!errors.agency}
          helperText={errors.agency}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#3b0a75",
            ":hover": { backgroundColor: "#3b0a75" },
          }}
        >
          Salvar Conta
        </Button>
      </Box>
    </Paper>
  );
}
