import React from "react";
import type { BankAccount } from "../../types/bank-account";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableBase } from "../TableBase"; // caminho do seu TableBase

interface BankAccountTableProps {
  bankAccounts: BankAccount[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (bankAccount: BankAccount) => void;
}

const BankAccountsTable: React.FC<BankAccountTableProps> = ({
  bankAccounts,
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
      maxHeight={400} // opcional
      maxCellWidth={200} // opcional
      renderRow={(account) => (
        <>
          <td align="center">{account.name}</td>
          <td align="center">{account.agency}</td>
          <td align="center">{account.number || "-"}</td>
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
      )}
    />
  );
};

export default BankAccountsTable;
