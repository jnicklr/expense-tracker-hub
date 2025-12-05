import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox
} from "@mui/material";

import { useState, useCallback, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import { z } from "zod";

import { createTransaction, updateTransaction } from "../../services/transactionService";
import type { BankAccount } from "../../types/bank-account";
import type { Category } from "../../types/category";
import type { Transaction } from "../../types/transaction";
import type { TransactionType } from "../../types/transaction-type";

// Schema compartilhado
const transactionSchema = z.object({
    bankAccountId: z.number().min(1, { message: "Conta bancária é obrigatória" }),
    categoryId: z.number().min(1, { message: "Categoria é obrigatória" }),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().min(0.01, { message: "Valor deve ser maior que 0" }),
    description: z.string().optional(),
    isEssential: z.boolean(),
    transactionAt: z.string().min(1, { message: "Data da transação é obrigatória" }),
});

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void; // recarrega lista
    mode: "create" | "edit";
    transaction?: Transaction | null; // usado no modo "edit"
    bankAccounts: BankAccount[];
    categories: Category[];
}

export default function TransactionFormDialog({
    open,
    onClose,
    onSuccess,
    mode,
    transaction,
    bankAccounts,
    categories
}: Props) {

    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        bankAccountId: 0,
        categoryId: 0,
        type: "EXPENSE" as TransactionType,
        amount: 0,
        description: "",
        isEssential: false,
        transactionAt: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState("");
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

    const handleClick = () => setOpenSnackBar(true);
    const handleCloseSnack = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenSnackBar(false);
    };

    useEffect(() => {
        if (errors.general || success) {
            const timer = setTimeout(() => {
                setErrors({ general: "" });
                setSuccess("");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [errors.general, success]);

    // Carrega dados no modo "edit"
    useEffect(() => {
        if (open) {
            if (isEdit && transaction) {
                setForm({
                    bankAccountId: transaction.bankAccountId,
                    categoryId: transaction.categoryId,
                    type: transaction.type,
                    amount: transaction.amount,
                    description: transaction.description || "",
                    isEssential: transaction.isEssential,
                    transactionAt: transaction.transactionAt
                        ? new Date(transaction.transactionAt).toISOString().slice(0, 16)
                        : "",
                });
            } else {
                setForm({
                    bankAccountId: 0,
                    categoryId: 0,
                    type: "EXPENSE",
                    amount: 0,
                    description: "",
                    isEssential: false,
                    transactionAt: "",
                });
            }
            setErrors({});
            setSuccess("");
        }
    }, [open, isEdit, transaction]);


    const handleSubmit = useCallback(async () => {
        try {
            setErrors({});
            setSuccess("");

            // Corrige datetime-local para ISO completo
            const payload = {
                ...form,
                transactionAt: new Date(form.transactionAt + ":00").toISOString()
            };

            const parsed = transactionSchema.parse(payload);

            if (isEdit) {
                if (!transaction?.id) throw new Error("Transação inválida.");
                await updateTransaction(transaction.id, parsed);
                setSuccess("Transação atualizada com sucesso!");
            } else {
                await createTransaction(parsed);
                setSuccess("Transação criada com sucesso!");
            }

            onSuccess();
            handleClick();
            if (!isEdit) {
                setForm({
                    bankAccountId: 0,
                    categoryId: 0,
                    type: "EXPENSE",
                    amount: 0,
                    description: "",
                    isEssential: false,
                    transactionAt: "",
                });
            }
        } catch (err: any) {
            console.error(err);

            if (err?.issues) {
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((i: any) => (fieldErrors[i.path[0]] = i.message));
                setErrors(fieldErrors);
                return;
            }

            if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
                return;
            }

            setErrors({ general: err.message ?? "Erro inesperado" });
        }
    }, [form, isEdit, transaction, onSuccess]);

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }}>
                {isEdit ? "Editar Transação" : "Criar Nova Transação"}
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {errors.general && <Alert severity="error">{errors.general}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <FormControl fullWidth>
                    <TextField
                        select
                        label="Conta Bancária"
                        value={form.bankAccountId}
                        onChange={(e) => setForm({ ...form, bankAccountId: Number(e.target.value) })}
                        error={!!errors.bankAccountId}
                        helperText={errors.bankAccountId}
                        margin="normal"
                    >
                        <MenuItem value={0} disabled>Selecione uma conta</MenuItem>
                        {bankAccounts.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                    </TextField>
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        select
                        label="Categoria"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                        error={!!errors.categoryId}
                        helperText={errors.categoryId}
                        margin="normal"
                    >
                        <MenuItem value={0} disabled>Selecione uma categoria</MenuItem>
                        {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </TextField>
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        select
                        label="Tipo"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                        margin="normal"
                    >
                        <MenuItem value="INCOME">Entrada</MenuItem>
                        <MenuItem value="EXPENSE">Saída</MenuItem>
                    </TextField>
                </FormControl>

                <TextField
                    type="number"
                    label="Valor"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    fullWidth
                    margin="normal"
                    error={!!errors.amount}
                    helperText={errors.amount}
                />

                <TextField
                    label="Descrição"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description}
                />

                <TextField
                    type="datetime-local"
                    label="Data da Transação"
                    value={form.transactionAt}
                    onChange={(e) => setForm({ ...form, transactionAt: e.target.value })}
                    fullWidth
                    margin="normal"
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
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? "Salvar Alterações" : "Criar Transação"}
                </Button>
            </DialogActions>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
                message={isEdit ? "Edição realizada com sucesso" : "Cadastro realizado com sucesso"}
                action={<IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}><CloseIcon fontSize="small" /></IconButton>}
            />
        </Dialog>
    );
}
