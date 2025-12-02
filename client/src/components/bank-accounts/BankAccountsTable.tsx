import React from "react";
import type { BankAccount } from "../../types/bank-account";
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

interface BankAccountTableProps {
  bankAccounts: BankAccount[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (bankAccount: BankAccount) => void; // Nova função para editar
}

const BankAccountsTable: React.FC<BankAccountTableProps> = ({
  bankAccounts,
  deletingId,
  onDelete,
  onEdit,
}) => {
  const colunas: string[] = [
    "Nome",
    "Entradas",
    "Saídas",
    "Ações",
  ];

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
          {bankAccounts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhum paciente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            bankAccounts.map((bankAccount) => (
              <TableRow key={bankAccount.id} hover className="hover:bg-blue-50">
                <TableCell align="center">{bankAccount.name}</TableCell>
                <TableCell align="center">{bankAccount.agency}</TableCell>
                <TableCell align="center">{bankAccount.number || "-"}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(bankAccount)} // Clicar = abrir modal de edição
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(bankAccount.id)}
                        disabled={deletingId === bankAccount.id}
                        aria-label={`remover-${bankAccount.id}`}
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
};

export default BankAccountsTable;
