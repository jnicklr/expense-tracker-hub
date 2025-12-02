import { TransactionType } from "../types/transaction-type";
import type { User } from "../types/user";
import type { BankAccount } from "../types/bank-account";
import type { Transaction } from "../types/transaction";
import type { Category } from "../types/category";

//
// 1) Criamos o user primeiro, mas deixamos bankAccount e categories vazios
//
const mockUser: User = {
  id: 1,
  name: "Ester",
  email: "ester@gmail.com",
  password: "ester",
  createdAt: new Date(),
  updatedAt: new Date(),
  bankAccount: [],  // preenchido depois
  categories: [],   // preenchido depois
};

//
// 2) Criamos as categorias sem referência ao user ainda (para evitar ciclo)
//
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Salário",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,   // agora podemos colocar user
    transactions: [], // obrigatório
  },
  {
    id: 2,
    name: "Alimentação",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    transactions: [],
  },
];

//
// 3) Agora conectamos categories ao usuário
//
mockUser.categories = mockCategories;

//
// 4) Criamos a BankAccount
//
const mockBankAccount: BankAccount = {
  id: 1,
  userId: 1,
  name: "Conta Principal",
  number: "123456",
  agency: "0001",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser,
  transactions: [], // preenchido depois
};

//
// 5) Conectamos bankAccount ao usuário
//
mockUser.bankAccount = [mockBankAccount];

//
// 6) Criamos transactions corretamente
//
const mockTransactions: Transaction[] = [
  {
    id: 1,
    bankAccountId: 1,
    categoryId: 1,
    type: TransactionType.INCOME,
    amount: 5430.5,
    description: "Salário",
    isEssential: true,
    transactionAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    bankAccount: mockBankAccount,
    category: mockCategories[0], // correto
  },
  {
    id: 2,
    bankAccountId: 1,
    categoryId: 2,
    type: TransactionType.EXPENSE,
    amount: 120,
    description: "Supermercado",
    isEssential: true,
    transactionAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    bankAccount: mockBankAccount,
    category: mockCategories[1],
  },
];

//
// 7) Conecta transactions na conta e nas categorias
//
mockBankAccount.transactions = mockTransactions;
mockCategories[0].transactions = [mockTransactions[0]];
mockCategories[1].transactions = [mockTransactions[1]];

//
// 8) Exporta
//
export const mockAccounts = [mockBankAccount];
export const mockUserFull = mockUser;
export const mockCategoriesFull = mockCategories;
