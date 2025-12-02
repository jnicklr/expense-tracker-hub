import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from "@mui/material";

import { createBankAccount } from "../../services/bankAccountService";
import { createBankAccountSchema } from "../../schemas/bankAccountSchema";

interface CreateBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

export function CreateBankAccountModal({
  open,
  onClose,
  reload,
}: CreateBankAccountModalProps) { 
    const [form, setForm] = useState({
      name: "",
      number: "",
      agency: "",
  });


  const handleSubmit = async () => {
    const parsed = createBankAccountSchema.safeParse(form);

    if (!parsed.success) {
      alert("Dados inválidos");
      return;
    }

    await createBankAccount({ ...form, userId: 1 }); // user fixo por agora
    reload();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cadastrar Nova Conta</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="Nome do Banco"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />

          <TextField
            label="Número da Conta"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            fullWidth
          />

          <TextField
            label="Agência"
            value={form.agency}
            onChange={(e) => setForm({ ...form, agency: e.target.value })}
            fullWidth
          />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar Conta
        </Button>
      </DialogActions>
    </Dialog>
  );
}




// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { z } from "zod";
// import { validateField } from "../../schemas/validators";

// interface CreateBankAccountModal {
//   open: boolean;
//   onClose: () => void;
//   onSave: (dados: {
//     accountName: string;
//     bankName: string;
//     type: string;
//     initialBalance: number;
//   }) => Promise<void>;
// }

// const createBankAccountSchema = z.object({
//   accountName: z.string().min(1, "Nome da conta obrigatório"),
//   bankName: z.string().min(1, "Nome do banco obrigatório"),
//   type: z.string().min(1, "Tipo obrigatório"),
//   initialBalance: z
//     .number()
//     .nonnegative("Saldo inicial não pode ser negativo"),
// });

// export const CriarBankAccountModal = ({
//   open,
//   onClose,
//   onSave,
// }: CreateBankAccountModal) => {
//   const [formData, setFormData] = useState({
//     accountName: "",
//     bankName: "",
//     type: "Checking",
//     initialBalance: 0,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setFormData({
//         accountName: "",
//         bankName: "",
//         type: "Checking",
//         initialBalance: 0,
//       });
//       setErrors({});
//       setTouched({});
//     }
//   }, [open]);

//   const handleInputChange = (field: string, value: string | number) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     if (touched[field]) {
//       const error = validateField(createBankAccountSchema, field, value);
//       setErrors((prev) => ({ ...prev, [field]: error }));
//     }
//   };

//   const handleBlur = (field: string) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     const value = formData[field as keyof typeof formData];
//     const error = validateField(createBankAccountSchema, field, value);
//     setErrors((prev) => ({ ...prev, [field]: error }));
//   };

//   const handleSubmit = async () => {
//     const newTouched: Record<string, boolean> = {};
//     const newErrors: Record<string, string> = {};

//     for (const key of Object.keys(formData)) {
//       newTouched[key] = true;
//       const error = validateField(
//         createBankAccountSchema,
//         key,
//         formData[key as keyof typeof formData]
//       );
//       if (error) newErrors[key] = error;
//     }

//     setTouched(newTouched);
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) return;

//     setLoading(true);

//     try {
//       await onSave({
//         ...formData,
//         initialBalance: Number(formData.initialBalance),
//       });
//       onClose();
//     } catch (err) {
//       console.error("Erro ao criar conta bancária:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Adicionar Nova Conta</DialogTitle>

//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//           <TextField
//             label="Account Name"
//             value={formData.accountName}
//             onChange={(e) => handleInputChange("accountName", e.target.value)}
//             onBlur={() => handleBlur("accountName")}
//             error={touched.accountName && !!errors.accountName}
//             helperText={touched.accountName && errors.accountName}
//             fullWidth
//           />

//           <TextField
//             label="Bank Name"
//             value={formData.bankName}
//             onChange={(e) => handleInputChange("bankName", e.target.value)}
//             onBlur={() => handleBlur("bankName")}
//             error={touched.bankName && !!errors.bankName}
//             helperText={touched.bankName && errors.bankName}
//             fullWidth
//           />

//           <TextField
//             select
//             label="Account Type"
//             value={formData.type}
//             onChange={(e) => handleInputChange("type", e.target.value)}
//             onBlur={() => handleBlur("type")}
//             error={touched.type && !!errors.type}
//             helperText={touched.type && errors.type}
//             fullWidth
//           >
//             <MenuItem value="Checking">Checking</MenuItem>
//             <MenuItem value="Savings">Savings</MenuItem>
//             <MenuItem value="Credit Card">Credit Card</MenuItem>
//           </TextField>

//           <TextField
//             label="Initial Balance"
//             type="number"
//             value={formData.initialBalance}
//             onChange={(e) =>
//               handleInputChange("initialBalance", Number(e.target.value))
//             }
//             onBlur={() => handleBlur("initialBalance")}
//             error={touched.initialBalance && !!errors.initialBalance}
//             helperText={touched.initialBalance && errors.initialBalance}
//             fullWidth
//           />
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Save Account"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
