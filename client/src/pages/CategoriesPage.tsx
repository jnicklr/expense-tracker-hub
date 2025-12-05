import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { useDebounce } from "../hooks/useDebounce";

import type { Category } from "../types/category";
import { getCategories, deleteCategory } from "../services/categoryService";

import { CategoriesTable } from "../components/categories/CategoriesTable";
import CategoryFormDialog from "../components/categories/CategoryForm";

export const CategoriesPage = () => {
    const theme = useTheme();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const search = useDebounce(searchTerm, 500);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadCategories = useCallback(async () => {
        const res = await getCategories(page, limit, search);

        setCategories(res.data);
        setTotalPages(res.totalPages);
    }, [page, limit, search]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <Box
            sx={{
                width: "100%",
                pt: 3,
                px: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" fontWeight={700}>
                    Gerencie suas Categorias
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    + Nova Categoria
                </Button>
            </Box>

            {/* SEARCH BAR */}
            <TextField
                placeholder="Buscar por categoria..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                    borderRadius: 3,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* TABLE */}
            <CategoriesTable
                categories={categories}
                deletingId={deletingId}
                page={page}
                totalPages={totalPages}
                limit={limit}
                onLimitChange={setLimit}
                onPageChange={setPage}
                onEdit={(category) => {
                    setCategoryToEdit(category);
                    setOpenEdit(true);
                }}
                onDelete={async (id) => {
                    setDeletingId(id);

                    try {
                        const res: any = await deleteCategory(id);

                        if (res?.status >= 500) {
                            setErrorMessage("Erro ao excluir categoria. Tente novamente.");
                        } else {
                            await loadCategories();
                        }

                    } catch (err: any) {
                        console.error(err);
                        setErrorMessage(
                            err?.response?.data?.message ||
                            "Erro inesperado ao tentar excluir categoria."
                        );
                    } finally {
                        setDeletingId(null);
                    }
                }}
            />

            {/* POPUP DE ERRO */}
            {errorMessage && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        backgroundColor: "rgba(0, 0, 0, 0.3)", // leve overlay
                    }}
                    onClick={() => setErrorMessage(null)}
                >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: "white",
                            px: 4,
                            py: 3,
                            borderRadius: 3,
                            boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
                            minWidth: "320px",
                            maxWidth: "90%",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Typography variant="h6" fontWeight={700}>
                            Erro
                        </Typography>
                        <Typography mt={1}>{errorMessage}</Typography>
                    </Box>
                </Box>
            )}

            <CategoryFormDialog
                open={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={loadCategories}
                mode="create"
            />

            <CategoryFormDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadCategories}
                mode="edit"
                category={categoryToEdit}
            />

        </Box>
    );
};

export default CategoriesPage;
