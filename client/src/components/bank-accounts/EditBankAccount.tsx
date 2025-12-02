import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { z } from "zod";
import { validateField } from "../../schemas/validators";

interface EditBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  account: {
    id: number;
    accountName: string;
    bankName: string;
    type: string;
    initialBalance: number;
  } | null;
  onSave: (dados: {
    accountName: string;
    bankName: string;
    type: string;
    initialBalance: number;
  }) => Promise<void>;
}

const bankAccountSchema = z.object({
  accountName: z.string().min(1, "Nome da conta obrigatório"),
  bankName: z.string().min(1, "Nome do banco obrigatório"),
  type: z.string().min(1, "Tipo obrigatório"),
  initialBalance: z
    .number()
    .nonnegative("Saldo inicial não pode ser negativo"),
});

export const EditBankAccountModal = ({
  open,
  onClose,
  account,
  onSave,
}: EditBankAccountModalProps) => {
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    type: "Checking",
    initialBalance: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Carrega os dados da conta ao abrir o modal
  useEffect(() => {
    if (open && account) {
      setFormData({
        accountName: account.accountName,
        bankName: account.bankName,
        type: account.type,
        initialBalance: account.initialBalance,
      });
      setErrors({});
      setTouched({});
    }
  }, [open, account]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(bankAccountSchema, field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    const error = validateField(bankAccountSchema, field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    for (const key of Object.keys(formData)) {
      newTouched[key] = true;
      const error = validateField(
        bankAccountSchema,
        key,
        formData[key as keyof typeof formData]
      );
      if (error) newErrors[key] = error;
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await onSave({
        ...formData,
        initialBalance: Number(formData.initialBalance),
      });
      onClose();
    } catch (error) {
      console.error("Erro ao editar conta:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Conta</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Account Name"
            value={formData.accountName}
            onChange={(e) => handleInputChange("accountName", e.target.value)}
            onBlur={() => handleBlur("accountName")}
            error={touched.accountName && !!errors.accountName}
            helperText={touched.accountName && errors.accountName}
            fullWidth
          />

          <TextField
            label="Bank Name"
            value={formData.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            onBlur={() => handleBlur("bankName")}
            error={touched.bankName && !!errors.bankName}
            helperText={touched.bankName && errors.bankName}
            fullWidth
          />

          <TextField
            select
            label="Account Type"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            onBlur={() => handleBlur("type")}
            error={touched.type && !!errors.type}
            helperText={touched.type && errors.type}
            fullWidth
          >
            <MenuItem value="Checking">Checking</MenuItem>
            <MenuItem value="Savings">Savings</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
          </TextField>

          <TextField
            label="Initial Balance"
            type="number"
            value={formData.initialBalance}
            onChange={(e) =>
              handleInputChange("initialBalance", Number(e.target.value))
            }
            onBlur={() => handleBlur("initialBalance")}
            error={touched.initialBalance && !!errors.initialBalance}
            helperText={touched.initialBalance && errors.initialBalance}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Salvar Alterações"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
