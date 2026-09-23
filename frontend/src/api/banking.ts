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
export type TransferDetails = {
  transferId: number;
  referenceNumber: string;
  status: string;
  amount: number;
  completedAt: string;
};
export type Analytics = {
  accountNumber: string;
  weeklyActivity: { date: string; deposits: number; withdrawals: number }[];
  monthlyExpenses: { month: string; withdrawals: number }[];
  balanceHistory: { month: string; closingBalance: number }[];
};
export type PublicContent = {
  contentId: number;
  contentType: 'OFFER' | 'INVESTOR' | 'ABOUT_US' | 'CONTACT_US';
  contentKey: string;
  title: string;
  contentBody: string;
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  displayOrder: number;
};
export type PublicHome = { bankName: string; welcomeMessage: string; offers: PublicContent[] };

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
export const getTransfer = (referenceNumber: string) =>
  client.get<TransferDetails>(`/api/v1/transfers/${encodeURIComponent(referenceNumber)}`);
export const getPublicHome = () => client.get<PublicHome>('/api/v1/public/home');
export const getOffers = () => client.get<PublicContent[]>('/api/v1/public/offers');
export const getInvestors = () => client.get<PublicContent[]>('/api/v1/public/investors');
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
export const changeLoginPassword = (payload: { currentPassword: string; newPassword: string }) =>
  client.put('/api/v1/auth/passwords/login', payload);
