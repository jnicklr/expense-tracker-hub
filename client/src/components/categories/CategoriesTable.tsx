import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableBase } from "../TableBase"; // ajuste o caminho conforme sua estrutura
import type { Category } from "../../types/category";

interface Props {
  categories: Category[];
  deletingId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoriesTable: React.FC<Props> = ({
  categories,
  deletingId,
  onEdit,
  onDelete,
}) => {
  const columns = ["Nome", "Descrição", "Ações"];

  return (
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
                  aria-label={`remover-${category.id}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </td>
        </>
      )}
    />
  );
};

export default CategoriesTable;
