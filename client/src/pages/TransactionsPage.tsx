import { useState, useEffect, useCallback, useMemo } from "react";
import type { Transaction } from "../types/transaction";
import type { BankAccount } from "../types/bank-account";
import type { Category } from "../types/category";

import { getTransaction, deleteTransaction } from "../services/transactionService";
import { getBankAccount } from "../services/bankAccountService";
import { getCategory } from "../services/categoryService";

import { Box, Typography, Button, useTheme } from "@mui/material";

import TransactionsTable from "../components/transactions/TransactionsTable";
import { CreateTransactionInline } from "../components/transactions/CreateTransactionInline";

import { useDebounce } from "../hooks/useDebounce";

export function TransactionsPage() {
  const theme = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    const load = async () => {
      const [t, b, c] = await Promise.all([
        getTransaction(),
        getBankAccount(),
        getCategory(),
      ]);
      setTransactions(t);
      setBankAccounts(b);
      setCategories(c);
    };
    load();
  }, []);

  const reload = useCallback(async () => {
    const t = await getTransaction();
    setTransactions(t);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filtradas = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return transactions;
    const termo = debouncedSearchTerm.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description?.toLowerCase().includes(termo) ||
        categories.find((c) => c.id === t.categoryId)?.name.toLowerCase().includes(termo) ||
        bankAccounts.find((b) => b.id === t.bankAccountId)?.name.toLowerCase().includes(termo)
    );
  }, [debouncedSearchTerm, transactions, categories, bankAccounts]);

  // Map para o formato esperado pela tabela
  const transactionsForTable = transactions.map((tx) => ({
    ...tx,
    transactionAt:
      tx.transactionAt instanceof Date
        ? tx.transactionAt.toISOString()
        : tx.transactionAt,
  }));

  return (
    <Box
      sx={{
        width: "100%",
        pt: 3,        // padding top igual ao dashboard
        px: 2,        // padding lateral mínimo
        display: "flex",
        flexDirection: "column",
        gap: 3,       // espaçamento entre seções
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
          Minhas Transações
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "Adicionar Transação"}
        </Button>
      </Box>

      {/* Formulário Inline */}
      {showForm && (
        <CreateTransactionInline
          open
          onClose={() => setShowForm(false)}
          reload={reload}
          bankAccounts={bankAccounts}
          categories={categories}
        />
      )}

      {/* Subtítulo */}
      <Typography
        variant="h6"
        fontWeight={600}
        color={theme.palette.text.primary}
      >
        Transações Cadastradas
      </Typography>

      {/* Tabela */}
      <TransactionsTable
        transactions={transactionsForTable}
        bankAccounts={bankAccounts}
        categories={categories}
        deletingId={deletingId}
        onDelete={async (id) => {
          setDeletingId(id);
          await deleteTransaction(id);
          await reload();
          setDeletingId(null);
        }}
        onEdit={() => {}}
      />
    </Box>
  );
}

export default TransactionsPage;
