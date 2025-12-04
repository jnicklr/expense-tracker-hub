import type { Category } from "../../types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface CategoriesTableProps {
  categories: Category[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  deletingId,
  onDelete,
  onEdit,
}: CategoriesTableProps) {
  const colunas = ["Nome", "Descrição", "Ações"];

  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-800">
            {colunas.map((coluna) => (
              <TableCell
                key={coluna}
                align="center"
                className="font-bold text-white"
              >
                {coluna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhuma categoria encontrada.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} hover className="hover:bg-blue-50">
                <TableCell align="center">{category.name}</TableCell>
                <TableCell align="center">
                  {category.description || "-"}
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(category)}
                      >
                        <EditIcon />
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
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

