import React from "react";
import { IconButton, Tooltip, Pagination, Box, Select, MenuItem, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableBase } from "../TableBase";
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
  page: number;
  totalPages: number;
  limit: number;
  onLimitChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  bankAccounts,
  categories,
  deletingId,
  page,
  totalPages,
  limit,
  onLimitChange,
  onPageChange,
  onDelete,
  onEdit,
}) => {
  const columns = ["Data", "Conta Bancária", "Categoria", "Tipo", "Valor", "Ações"];

  const getBankAccountName = (id: number) =>
    bankAccounts.find((b) => b.id === id)?.name || "-";

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "-";

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

  return (
    <>
      <TableBase
        columns={columns}
        data={transactions}
        emptyMessage="Nenhuma transação encontrada."
        maxHeight={500}
        maxCellWidth={200}
        renderRow={(tx) => (
          <>
            <td align="center">{new Date(tx.transactionAt).toLocaleString()}</td>
            <td align="center">{getBankAccountName(tx.bankAccountId)}</td>
            <td align="center">{getCategoryName(tx.categoryId)}</td>
            <td align="center">{tx.type === "INCOME" ? "Entrada" : "Saída"}</td>
            <td align="center">{formatCurrency(tx.amount)}</td>
            <td align="center">
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
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
                    aria-label={`remover-${tx.id}`}
                  >
                    <DeleteIcon />
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

export default TransactionsTable;
