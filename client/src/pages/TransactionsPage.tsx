import { useState, useEffect, useCallback, useMemo } from "react";
import type { Transaction as TransactionType } from "../types/transaction";
import type { BankAccount } from "../types/bank-account";
import type { Category } from "../types/category";

import { getTransaction, deleteTransaction } from "../services/transactionService";
import { getBankAccounts } from "../services/bankAccountService";
import { getCategories } from "../services/categoryService";

import { Box, Typography, Button, useTheme } from "@mui/material";

import TransactionsTable from "../components/transactions/TransactionsTable";
import { CreateTransactionInline } from "../components/transactions/CreateTransactionInline";

import { useDebounce } from "../hooks/useDebounce";

export function TransactionsPage() {
  const theme = useTheme();

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const search = useDebounce(searchTerm, 300);

  const loadTransactions = useCallback(async () => {
  const trx = await getTransaction();
  setTransactions(trx);
}, []);

const loadBankAccounts = useCallback(async () => {
  const res = await getBankAccounts(page, limit, search);
  setBankAccounts(res.items ?? res.data ?? res);
  setTotalPages(res.totalPages ?? 1);
}, [page, limit, search]);

const loadCategories = useCallback(async () => {
  const res = await getCategories(1, 9999, "");
  setCategories(res.data ?? res);
}, []);

useEffect(() => {
  const load = async () => {
    const [accounts, trx] = await Promise.all([
      getBankAccounts(page, limit, search),
      getTransaction()
    ]);
    setBankAccounts(accounts.items ?? accounts.data ?? accounts);
    setTransactions(trx);
    setTotalPages(accounts.totalPages ?? 1);
  };
  load();
}, [page, limit, search, loadTransactions]);

useEffect(() => {
  setPage(1);
}, [search]);

  const filtradas = useMemo(() => {
    if (!search.trim()) return transactions;
    const termo = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description?.toLowerCase().includes(termo) ||
        categories.find((c) => c.id === t.categoryId)?.name.toLowerCase().includes(termo) ||
        bankAccounts.find((b) => b.id === t.bankAccountId)?.name.toLowerCase().includes(termo)
    );
  }, [search, transactions, categories, bankAccounts]);

  const transactionsForTable = filtradas.map((tx) => ({
    ...tx,
    transactionAt: tx.transactionAt instanceof Date ? tx.transactionAt.toISOString() : tx.transactionAt,
  }));

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
          reload={loadTransactions}
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
        page={page}
        totalPages={totalPages}
        limit={limit}
        onLimitChange={setLimit}
        onPageChange={setPage}
        onDelete={async (id) => {
          setDeletingId(id);
          await deleteTransaction(id);
          await loadTransactions();
          setDeletingId(null);
        }}
        onEdit={() => {}}
      />
    </Box>
  );
}

export default TransactionsPage;
