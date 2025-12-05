import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, TextField, InputAdornment, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useDebounce } from "../hooks/useDebounce";

import type { BankAccount } from "../types/bank-account";
import type { Transaction } from "../types/transaction";
import { getBankAccounts, deleteBankAccount } from "../services/bankAccountService";
import { getTransactions } from "../services/transactionService";

import BankAccountTable from "../components/bank-accounts/BankAccountsTable";
import { CreateBankAccountInline } from "../components/bank-accounts/CreateBankAccountInline";

export const BankAccountPage = () => {
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const search = useDebounce(searchTerm, 500);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadBankAccounts = useCallback(async () => {
    const res = await getBankAccounts(page, limit, search);
    setBankAccounts(res.items ?? res.data ?? res);
    setTotalPages(res.totalPages ?? 1);
  }, [page, limit, search]);

  const loadTransactions = useCallback(async () => {
    const trx = await getTransactions();
    setTransactions(trx);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [accounts, trx] = await Promise.all([
        getBankAccounts(page, limit, search),
        getTransactions()
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

  return (
    <Box sx={{ width: "100%", pt: 3, px: 2, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={700}>
          Minhas Contas Bancárias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "+ Nova Conta"}
        </Button>
      </Box>

      {/* SEARCH */}
      <TextField
        placeholder="Buscar por conta..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ borderRadius: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* TABLE */}
      <BankAccountTable
        bankAccounts={bankAccounts}
        transactions={transactions}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onLimitChange={setLimit}
        onPageChange={setPage}
        deletingId={deletingId}
        onDelete={async (id) => {
          setDeletingId(id);
          try {
            const res: any = await deleteBankAccount(id);
            if (res?.status >= 500) {
              setErrorMessage("Erro ao excluir conta. Tente novamente.");
            } else {
              await loadBankAccounts();
              await loadTransactions();
            }
          } catch (err: any) {
            console.error(err);
            setErrorMessage(
              err?.response?.data?.message || "Erro inesperado ao tentar excluir conta."
            );
          } finally {
            setDeletingId(null);
          }
        }}
        onEdit={() => {}}
      />

      {/* FORM */}
      {showForm && (
        <CreateBankAccountInline
          open
          onClose={() => setShowForm(false)}
          reload={() => {
            loadBankAccounts();
            loadTransactions();
          }}
        />
      )}

      {/* ERROR POPUP */}
      {errorMessage && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => setErrorMessage(null)}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.error.main,
              color: "white",
              px: 4,
              py: 3,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
              minWidth: "320px",
              maxWidth: "90%",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Erro
            </Typography>
            <Typography mt={1}>{errorMessage}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BankAccountPage;
