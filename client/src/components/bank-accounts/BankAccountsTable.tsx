import React from "react";
import type { BankAccount } from "../../types/bank-account";
import type { Transaction } from "../../types/transaction";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableBase } from "../TableBase";

interface BankAccountTableProps {
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (bankAccount: BankAccount) => void;
}

const BankAccountsTable: React.FC<BankAccountTableProps> = ({
  bankAccounts,
  transactions,
  deletingId,
  onDelete,
  onEdit,
}) => {
  const columns = ["Nome", "Entradas", "Saídas", "Ações"];

  return (
    <TableBase
      columns={columns}
      data={bankAccounts}
      emptyMessage="Nenhuma conta bancária encontrada."
      maxHeight={400}
      maxCellWidth={200}
      renderRow={(account) => {
        const accountTransactions = transactions.filter(
          (t) => t.bankAccountId === account.id
        );

        const totalIncome = accountTransactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = accountTransactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <>
            <td align="center">{account.name}</td>
            <td align="center">R$ {totalIncome.toFixed(2)}</td>
            <td align="center">R$ {totalExpense.toFixed(2)}</td>
            <td align="center">
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                <Tooltip title="Editar">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onEdit(account)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(account.id)}
                    disabled={deletingId === account.id}
                    aria-label={`remover-${account.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </td>
          </>
        );
      }}
    />
  );
};

export default BankAccountsTable;
