import { useState, useEffect, useCallback, useMemo } from "react";
import type { BankAccount } from "../types/bank-account";
import { getBankAccount, deleteBankAccount } from "../services/bankAccountService";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import BankAccountTable from "../components/bank-accounts/BankAccountsTable";
import { CreateBankAccountInline } from "../components/bank-accounts/CreateBankAccountInline";
import { useDebounce } from "../hooks/useDebounce";

export const BankAccountPage = () => {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const data = await getBankAccount();
      setBankAccounts(data);
    };
    carregar();
  }, []);

  const loadAccounts = useCallback(async () => {
  const data = await getBankAccount();
  setBankAccounts(data);
}, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filtrados = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return bankAccounts;
    const termo = debouncedSearchTerm.toLowerCase();

    return bankAccounts.filter((b) =>
      b.name.toLowerCase().includes(termo)
    );
  }, [debouncedSearchTerm, bankAccounts]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      width="100%"
      sx={{
        maxWidth: "1600px", 
        margin: "0 auto",
      }}
    >

      {/* Título + botão */}
      <Box
        width="100%"
        maxWidth="1000px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        mr={3}
      >
        <Typography variant="h3" fontWeight={700} color="#4b0082">
          Minhas Contas Bancárias
        </Typography>

        <Button
          variant="contained"
          sx={{ bgcolor: "#4b0082",  textTransform: "none", px: 2, borderRadius: 2, }}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Fechar" : "Adicionar Nova Conta"}
        </Button>
      </Box>

      {showForm && (

        <CreateBankAccountInline
          open={true}
          onClose={() => setShowForm(false)}
          reload={loadAccounts}
        />
      )}

      {/* Título da lista */}
      <Box width="100%" maxWidth="1000px" mb={2}>
        <Typography variant="h5" fontWeight={600} color="#4b0082">
          Contas Cadastradas
        </Typography>
      </Box>

        <BankAccountTable
          bankAccounts={filtrados}
          deletingId={deletingId}
          onDelete={async (id) => {
            setDeletingId(id);
            await deleteBankAccount(id);
            await loadAccounts();
            setDeletingId(null);
          }}
          onEdit={() => {}}
        />

    </Box>
  );
};

export default BankAccountPage;
