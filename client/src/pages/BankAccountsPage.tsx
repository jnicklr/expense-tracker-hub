import { useState, useEffect, useCallback, useMemo } from "react";
import type { BankAccount } from "../types/bank-account";
import { getBankAccount, deleteBankAccount } from "../services/bankAccountService";
import { Box, Typography, Button, useTheme } from "@mui/material";
import BankAccountTable from "../components/bank-accounts/BankAccountsTable";
import { CreateBankAccountInline } from "../components/bank-accounts/CreateBankAccountInline";
import { useDebounce } from "../hooks/useDebounce";

export const BankAccountPage = () => {
  const theme = useTheme();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadAccounts = useCallback(async () => {
    const data = await getBankAccount();
    setBankAccounts(data);
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

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
          reload={loadAccounts}
        />
      )}

      {/* Subtítulo */}
      <Typography
        variant="h6"
        fontWeight={600}
        color={theme.palette.text.primary}
      >
        Contas Cadastradas
      </Typography>

      {/* Tabela */}
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
