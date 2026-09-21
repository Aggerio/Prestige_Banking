import client from 'api/client';

export type Account = {
  accountNumber: string;
  accountType: string;
  balance: number;
  transferLimit: number;
  minimumBalance: number;
  status: string;
};
export type Card = {
  cardId: number;
  maskedPan: string;
  cardType: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  status: string;
  accountNumber: string;
  accountType: string;
  availableBalance: number;
};
export type Customer = { customerId: number; customerName: string; age: number; status: string };
export type Transaction = {
  transactionId: number;
  referenceNumber: string;
  movement: 'DEPOSIT' | 'WITHDRAWAL';
  transactionType: 'CREDIT' | 'DEBIT';
  amount: number;
  transactionAt: string;
  remarks: string;
};
export type TransactionPage = {
  accountNumber: string;
  items: Transaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export type Analytics = {
  accountNumber: string;
  weeklyActivity: { date: string; deposits: number; withdrawals: number }[];
  monthlyExpenses: { month: string; withdrawals: number }[];
  balanceHistory: { month: string; closingBalance: number }[];
};

export const login = (customerId: number, password: string) =>
  client.post('/api/v1/auth/login', { customerId, password });
export const logout = () => client.post('/api/v1/auth/logout');
export const getCustomer = () => client.get<Customer>('/api/v1/customers/me');
export const getAccounts = () => client.get<Account[]>('/api/v1/accounts');
export const getCards = () => client.get<Card[]>('/api/v1/cards');
export const getTransactions = (accountNumber: string, params: Record<string, unknown>) =>
  client.get<TransactionPage>(`/api/v1/accounts/${accountNumber}/transactions`, { params });
export const getAnalytics = (accountNumber: string) =>
  client.get<Analytics>(`/api/v1/accounts/${accountNumber}/analytics`, { params: { months: 12 } });
export const createTransfer = (payload: {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  destinationAccountHolderName: string;
  destinationIfscCode: string;
  amount: number;
  transactionPassword: string;
}) =>
  client.post('/api/v1/transfers', payload, {
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  });
