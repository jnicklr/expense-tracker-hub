import React from "react";
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

import type { BankAccount } from "../../types/bank-account";
import type { Category } from "../../types/category";

interface Transaction {
  id: number;
  bankAccountId: number;
  categoryId: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  transactionAt: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  bankAccounts: BankAccount[];
  categories: Category[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  bankAccounts,
  categories,
  deletingId,
  onDelete,
  onEdit,
}) => {
  const colunas = ["Data", "Conta Bancária", "Categoria", "Tipo", "Valor", "Ações"];

  const getBankAccountName = (id: number) =>
    bankAccounts.find((b) => b.id === id)?.name || "-";

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "-";

  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-800">
            {colunas.map((coluna) => (
              <TableCell key={coluna} align="center" className="font-bold text-white">
                {coluna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-6 text-gray-500">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} hover className="hover:bg-blue-50">
                <TableCell align="center">{new Date(tx.transactionAt).toLocaleString()}</TableCell>
                <TableCell align="center">{getBankAccountName(tx.bankAccountId)}</TableCell>
                <TableCell align="center">{getCategoryName(tx.categoryId)}</TableCell>
                <TableCell align="center">{tx.type === "INCOME" ? "Entrada" : "Saída"}</TableCell>
                <TableCell align="center">{tx.amount.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton color="primary" size="small" onClick={() => onEdit(tx)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(tx.id)}
                        disabled={deletingId === tx.id}
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

export default TransactionsTable;
