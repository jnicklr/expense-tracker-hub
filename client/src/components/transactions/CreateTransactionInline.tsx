import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { createTransaction } from "../../services/transactionService";
import { createTransactionSchema } from "../../schemas/transactionSchema";

import { getBankAccount } from "../../services/bankAccountService";
import { getCategory } from "../../services/categoryService";

import type { BankAccount } from "../../types/bank-account";
import type { Category } from "../../types/category";

interface Props {
  open: boolean;
  onClose: () => void;
  reload: () => void;
  bankAccounts: BankAccount[];
  categories: Category[];
}

export function CreateTransactionInline({ open, onClose, reload }: Props) {
  const [form, setForm] = useState({
    bankAccountId: 0,
    categoryId: 0,
    type: "EXPENSE",
    amount: 0,
    description: "",
    isEssential: false,
    transactionAt: "",
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgSuccess, setMsgSuccess] = useState("");

  // Carregar contas + categorias ao abrir
  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        const [acc, cat] = await Promise.all([
          getBankAccount(),
          getCategory(),
        ]);
        setBankAccounts(acc);
        setCategories(cat);
      } catch (err) {
        console.error("Erro ao carregar contas/categorias", err);
      }
    };

    loadData();
  }, [open]);

  if (!open) return null;

  const handleSubmit = useCallback(async () => {
  setErrors({});
  setMsgSuccess("");

  // Validação simples de IDs
  if (form.bankAccountId === 0 || form.categoryId === 0) {
    setErrors({
      bankAccountId: form.bankAccountId === 0 ? "Selecione uma conta" : "",
      categoryId: form.categoryId === 0 ? "Selecione uma categoria" : "",
    });
    return;
  }

  if (!form.transactionAt) {
    setErrors({ transactionAt: "A data da transação é obrigatória" });
    return;
  }

  try {
    // Corrige datetime-local para ISO 8601 completo
    const dateStr = form.transactionAt;
    const isoTransactionAt = new Date(dateStr + ":00").toISOString();

    const payload = {
      ...form,
      transactionAt: isoTransactionAt,
    };

    const parsed = createTransactionSchema.parse(payload);

    await createTransaction(parsed);

    setMsgSuccess("Transação criada com sucesso!");
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
      alert(err.message || "Erro ao criar transação");
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
      <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: "#3b0a75" }}>
        Adicionar Transação
      </Typography>

      {msgSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msgSuccess}
        </Alert>
      )}

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
        {/* Conta Bancária */}
        <TextField
          select
          label="Conta Bancária"
          value={form.bankAccountId}
          onChange={(e) => setForm({ ...form, bankAccountId: Number(e.target.value) })}
          fullWidth
          error={!!errors.bankAccountId}
          helperText={errors.bankAccountId}
        >
          <MenuItem value={0} disabled>
            Selecione uma conta
          </MenuItem>
          {bankAccounts.map((acc) => (
            <MenuItem key={acc.id} value={acc.id}>
              {acc.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Categoria */}
        <TextField
          select
          label="Categoria"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
          fullWidth
          error={!!errors.categoryId}
          helperText={errors.categoryId}
        >
          <MenuItem value={0} disabled>
            Selecione uma categoria
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Tipo */}
        <TextField
          select
          label="Tipo"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          fullWidth
        >
          <MenuItem value="INCOME">Entrada</MenuItem>
          <MenuItem value="EXPENSE">Saída</MenuItem>
        </TextField>

        {/* Valor */}
        <TextField
          type="number"
          label="Valor"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          fullWidth
          error={!!errors.amount}
          helperText={errors.amount}
        />
      </Box>

      <Box display="grid" gridTemplateColumns="1fr" gap={3} mb={3}>
        <TextField
          label="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
        />

        <TextField
          type="datetime-local"
          label="Data da Transação"
          value={form.transactionAt}
          onChange={(e) => setForm({ ...form, transactionAt: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.transactionAt}
          helperText={errors.transactionAt}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isEssential}
              onChange={(e) => setForm({ ...form, isEssential: e.target.checked })}
            />
          }
          label="Transação essencial"
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
          Salvar Transação
        </Button>
      </Box>
    </Paper>
  );
}
