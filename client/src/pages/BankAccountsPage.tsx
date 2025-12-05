import { useState, useEffect, useCallback, useMemo } from "react";
import type { BankAccount } from "../types/bank-account";
import type { Transaction } from "../types/transaction";

import { getBankAccount, deleteBankAccount } from "../services/bankAccountService";
import { getTransaction } from "../services/transactionService";

import { Box, Typography, Button, useTheme } from "@mui/material";
import BankAccountTable from "../components/bank-accounts/BankAccountsTable";
import { CreateBankAccountInline } from "../components/bank-accounts/CreateBankAccountInline";
import { useDebounce } from "../hooks/useDebounce";

export const BankAccountPage = () => {
  const theme = useTheme();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // <-- NOVO
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadAccounts = useCallback(async () => {
    const data = await getBankAccount();
    setBankAccounts(data);
  }, []);

  const loadTransactions = useCallback(async () => {
    const trx = await getTransaction();
    setTransactions(trx);
  }, []);

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, [loadAccounts, loadTransactions]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filtrados = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return bankAccounts;
    const termo = debouncedSearchTerm.toLowerCase();
    return bankAccounts.filter((b) => b.name.toLowerCase().includes(termo));
  }, [debouncedSearchTerm, bankAccounts]);

  return (
    <Box
      sx={{
        width: "100%",
        pt: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header + botão */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color={theme.palette.text.primary}
        >
          Minhas Contas Bancárias
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
          }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "Adicionar Nova Conta"}
        </Button>
      </Box>

      {/* Formulário Inline */}
      {showForm && (
        <CreateBankAccountInline
          open
          onClose={() => setShowForm(false)}
          reload={() => {
            loadAccounts();
            loadTransactions(); 
          }}
        />
      )}

      {/* Subtítulo */}
      <Typography variant="h6" fontWeight={600} color={theme.palette.text.primary}>
        Contas Cadastradas
      </Typography>

      {/* Tabela */}
      <BankAccountTable
        bankAccounts={filtrados}
        transactions={transactions} // <-- AQUI ENVIAMOS PARA A TABELA
        deletingId={deletingId}
        onDelete={async (id) => {
          setDeletingId(id);
          await deleteBankAccount(id);
          await loadAccounts();
          await loadTransactions(); // <-- atualizar soma
          setDeletingId(null);
        }}
        onEdit={() => {}}
      />
    </Box>
  );
};

export default BankAccountPage;
