import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";

import type { Category } from "../types/category";
import { getCategory, deleteCategory } from "../services/categoryService";

import { CreateCategoryInline } from "../components/categories/CreateCategoryInline";
import { CategoriesTable } from "../components/categories/CategoriesTable";

export const CategoriesPage = () => {
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
    <Box display="flex" flexDirection="column" alignItems="center" p={4} width="100%" sx={{ maxWidth: "1600px", margin: "0 auto" }}>
      <Box width="100%" maxWidth="1000px" display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h3" fontWeight={700} color="#4b0082">Minhas Categorias</Typography>
        <Button variant="contained" sx={{ bgcolor: "#4b0082", textTransform: "none", px: 2, borderRadius: 2 }} onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Fechar" : "Adicionar Categoria"}
        </Button>
      </Box>

      {showForm && <CreateCategoryInline open={true} onClose={() => setShowForm(false)} reload={loadCategories} />}

      <Box width="100%" maxWidth="1000px" mb={2}>
        <Typography variant="h5" fontWeight={600} color="#4b0082">Categorias Cadastradas</Typography>
      </Box>

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

