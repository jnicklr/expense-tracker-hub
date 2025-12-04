import { useState, useEffect, useCallback, useMemo } from "react";
import type { Transaction } from "../types/transaction";
import type { BankAccount } from "../types/bank-account";
import type { Category } from "../types/category";

import { getTransaction, deleteTransaction } from "../services/transactionService";
import { getBankAccount } from "../services/bankAccountService";
import { getCategory } from "../services/categoryService";

import { Box, Typography, Button } from "@mui/material";

import TransactionsTable from "../components/transactions/TransactionsTable";
import { CreateTransactionInline } from "../components/transactions/CreateTransactionInline";

import { useDebounce } from "../hooks/useDebounce";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  // Mapeia transactions para o tipo que a tabela espera
  const transactionsForTable = transactions.map((tx) => ({
    ...tx,
    transactionAt: tx.transactionAt instanceof Date ? tx.transactionAt.toISOString() : tx.transactionAt,
  }));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} width="100%">
      <Box
        width="100%"
        maxWidth="1000px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Typography variant="h3" fontWeight={700} color="#4b0082">
          Minhas Transações
        </Typography>

        <Button
          variant="contained"
          sx={{ bgcolor: "#4b0082", textTransform: "none", px: 2, borderRadius: 2 }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "Adicionar Transação"}
        </Button>
      </Box>

      {showForm && (
        <CreateTransactionInline
          open={true}
          onClose={() => setShowForm(false)}
          reload={reload}
          bankAccounts={bankAccounts}
          categories={categories}
        />
      )}

      <Box width="100%" maxWidth="1000px" mb={2}>
        <Typography variant="h5" fontWeight={600} color="#4b0082">
          Transações Cadastradas
        </Typography>
      </Box>

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
