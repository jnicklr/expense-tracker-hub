import { useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    Snackbar,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { createBankAccount, updateBankAccount } from "../../services/bankAccountService";
import { createBankAccountSchema } from "../../schemas/bankAccountSchema";
import type { BankAccount } from "../../types/bank-account";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void; // para recarregar a lista
    mode: "create" | "edit";
    bankAccount?: BankAccount | null;
}

export default function BankAccountFormDialog({ open, onClose, onSuccess, mode, bankAccount }: Props) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: "",
        number: "",
        agency: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMsg, setSuccessMsg] = useState("");
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        if (errors.general || successMsg) {
            const timer = setTimeout(() => {
                setErrors({ general: "" });
                setSuccessMsg("");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [errors.general, successMsg]);

    const handleSnackClose = (_: any, reason?: string) => {
        if (reason === "clickaway") return;
        setOpenSnack(false);
    };

    // Carrega dados no modo "edit"
    useEffect(() => {
        if (open) {
            if (isEdit && bankAccount) {
                setForm({
                    name: bankAccount.name,
                    number: bankAccount.number,
                    agency: bankAccount.agency,
                });
            } else {
                setForm({ name: "", number: "", agency: "" });
            }
            setErrors({});
            setSuccessMsg("");
        }
    }, [open, isEdit, bankAccount]);

    const handleSubmit = useCallback(async () => {
        setErrors({});
        setSuccessMsg("");

        try {
            const parsed = createBankAccountSchema.parse(form);

            if (isEdit && bankAccount?.id) {
                await updateBankAccount(bankAccount.id, parsed);
                setSuccessMsg("Conta atualizada com sucesso!");
            } else {
                await createBankAccount(parsed);
                setSuccessMsg("Conta criada com sucesso!");
            }

            setOpenSnack(true);
            onSuccess();

            if (!isEdit) {
                setForm({ name: "", number: "", agency: "" });
            }
        } catch (err: any) {
            if (err?.issues) {
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((issue: any) => {
                    if (issue.path.length > 0) fieldErrors[issue.path[0]] = issue.message;
                });
                setErrors(fieldErrors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: err.message ?? "Erro inesperado" });
            }
        }
    }, [form, isEdit, bankAccount, onSuccess, onClose]);

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }}>
                {isEdit ? "Editar Conta Bancária" : "Adicionar Nova Conta"}
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {errors.general && <Alert severity="error">{errors.general}</Alert>}
                {successMsg && <Alert severity="success">{successMsg}</Alert>}

                <TextField
                    label="Nome do Banco"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                />

                <TextField
                    label="Número"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.number}
                    helperText={errors.number}
                />

                <TextField
                    label="Agência"
                    value={form.agency}
                    onChange={(e) => setForm({ ...form, agency: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.agency}
                    helperText={errors.agency}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? "Salvar Alterações" : "Criar Conta"}
                </Button>
            </DialogActions>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={openSnack}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                message={isEdit ? "Conta atualizada com sucesso" : "Conta criada com sucesso"}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Dialog>
    );
}
