import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";

import type { Category } from "../types/category";
import { getCategory, deleteCategory } from "../services/categoryService";

import { CreateCategoryInline } from "../components/categories/CreateCategoryInline";
import { CategoriesTable } from "../components/categories/CategoriesTable";

export const CategoriesPage = () => {
  const theme = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadCategories = useCallback(async () => {
    const data = await getCategory();
    setCategories(data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filtradas = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return categories;
    const termo = debouncedSearchTerm.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(termo));
  }, [debouncedSearchTerm, categories]);

  return (
    <Box
      sx={{
        width: "100%",
        pt: 3,        // padding superior igual ao dashboard
        px: 2,        // padding mínimo lateral
        display: "flex",
        flexDirection: "column",
        gap: 3,       // espaçamento vertical entre seções
      }}
    >
      {/* Header + botão */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color={theme.palette.text.primary}
        >
          Minhas Categorias
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
          }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "Adicionar Categoria"}
        </Button>
      </Box>

      {/* Formulário Inline */}
      {showForm && (
        <CreateCategoryInline
          open
          onClose={() => setShowForm(false)}
          reload={loadCategories}
        />
      )}

      {/* Subtítulo */}
      <Typography
        variant="h6"
        fontWeight={600}
        color={theme.palette.text.primary}
      >
        Categorias Cadastradas
      </Typography>

      {/* Tabela */}
      <CategoriesTable
        categories={filtradas}
        deletingId={deletingId}
        onDelete={async (id) => {
          setDeletingId(id);
          await deleteCategory(id);
          await loadCategories();
          setDeletingId(null);
        }}
        onEdit={() => {}}
      />
    </Box>
  );
};

export default CategoriesPage;
