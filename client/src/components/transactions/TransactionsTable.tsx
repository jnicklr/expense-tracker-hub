import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableBase } from "../TableBase"; // caminho do seu TableBase
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
  const columns = ["Data", "Conta Bancária", "Categoria", "Tipo", "Valor", "Ações"];

  const getBankAccountName = (id: number) =>
    bankAccounts.find((b) => b.id === id)?.name || "-";

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "-";

  return (
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
          <td align="center">{tx.amount.toFixed(2)}</td>
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
  );
};

export default TransactionsTable;
