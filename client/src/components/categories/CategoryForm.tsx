import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    IconButton
} from "@mui/material";

import { useState, useCallback, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { z } from "zod";
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import { createCategory, updateCategory } from "../../services/categoryService";
import type { Category } from "../../types/category";

// Schema compartilhado
const categorySchema = z.object({
    name: z.string().min(1, { message: "Nome da categoria é obrigatório" }),
    description: z.string().optional(),
});

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;     // recarrega lista
    mode: "create" | "edit";
    category?: Category | null; // usado apenas no modo "edit"
}

export default function CategoryFormDialog({
    open,
    onClose,
    onSuccess,
    mode,
    category,
}: Props) {

    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState("");
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

    const handleClick = () => {
        setOpenSnackBar(true);
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };


    // Carrega dados no modo "edit"
    useEffect(() => {
        if (open) {
            if (isEdit && category) {
                setForm({
                    name: category.name,
                    description: category.description || "",
                });
            } else {
                setForm({ name: "", description: "" });
            }

            setErrors({});
            setSuccess("");
        }
    }, [open, isEdit, category]);

    const handleSubmit = useCallback(async () => {
        try {
            setErrors({});
            setSuccess("");

            const parsed = categorySchema.parse({
                ...form
            });

            if (isEdit) {
                if (!category?.id) throw new Error("Categoria inválida.");

                await updateCategory(category.id, parsed);
                setSuccess("Categoria atualizada com sucesso!");

            } else {
                await createCategory(parsed);
                setSuccess("Categoria criada com sucesso!");
            }

            onSuccess();
            handleClick();

            setForm({
                name: "",
                description: "",
            })

            // setTimeout(() => onClose(), 500);

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
    }, [form, isEdit, category, onSuccess, onClose]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }}>
                {isEdit ? "Editar Categoria" : "Criar Nova Categoria"}
            </DialogTitle>

            <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
                {errors.general && <Alert severity="error">{errors.general}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                    label="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
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
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? "Salvar Alterações" : "Criar Categoria"}
                </Button>
            </DialogActions>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleClose}
                message={isEdit ? "Edição realizada com sucesso" : "Cadastro realizado com sucesso"}
                action={<>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>}
            />
        </Dialog>
    );
}
