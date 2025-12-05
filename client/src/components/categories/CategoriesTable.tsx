import React from "react";
import {
    IconButton,
    Tooltip,
    Pagination,
    Box,
    Select,
    MenuItem,
    Typography
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { TableBase } from "../TableBase";
import type { Category } from "../../types/category";

interface Props {
    categories: Category[];
    deletingId: number | null;
    page: number;
    totalPages: number;
    limit: number;
    onLimitChange: (value: number) => void;
    onPageChange: (page: number) => void;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export const CategoriesTable: React.FC<Props> = ({
    categories,
    deletingId,
    page,
    totalPages,
    limit,
    onLimitChange,
    onPageChange,
    onEdit,
    onDelete,
}) => {
    const columns = ["Nome", "Descrição", "Ações"];

    return (
        <>
            <TableBase
                columns={columns}
                data={categories}
                emptyMessage="Nenhuma categoria encontrada."
                renderRow={(category: Category) => (
                    <>
                        <td>{category.name}</td>
                        <td>{category.description || "-"}</td>
                        <td>
                            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                                <Tooltip title="Editar">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onEdit(category)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Remover">
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => onDelete(category.id)}
                                        disabled={deletingId === category.id}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </td>
                    </>
                )}
            />

            {/* FOOTER: Select + Paginação */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                }}
            >
                {/* SELECT LIMIT */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">Itens por página:</Typography>

                    <Select
                        size="small"
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </Box>

                {/* PAGINAÇÃO */}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => onPageChange(value)}
                    color="primary"
                    shape="rounded"
                />
            </Box>
        </>
    );
};

export default CategoriesTable;
