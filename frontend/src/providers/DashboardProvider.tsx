import {
  Account,
  Analytics,
  Card,
  Customer,
  getAccounts,
  getAnalytics,
  getCards,
  getCustomer,
  getTransactions,
  Transaction,
  createTransfer,
} from 'api/banking';
import { apiError } from 'api/client';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type DashboardContextValue = {
  customer: Customer | null;
  accounts: Account[];
  cards: Card[];
  selectedAccount: string | null;
  transactions: Transaction[];
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  selectAccount: (accountNumber: string) => void;
  refresh: () => Promise<void>;
  transfer: (
    data: Omit<Parameters<typeof createTransfer>[0], 'sourceAccountNumber'>,
  ) => Promise<void>;
};
const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const DashboardProvider = ({ children }: PropsWithChildren) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [customerResponse, accountResponse, cardResponse] = await Promise.all([
        getCustomer(),
        getAccounts(),
        getCards(),
      ]);
      setCustomer(customerResponse.data);
      setAccounts(accountResponse.data);
      setCards(cardResponse.data);
      setSelectedAccount((current) =>
        current && accountResponse.data.some((account) => account.accountNumber === current)
          ? current
          : accountResponse.data[0]?.accountNumber || null,
      );
      setError(null);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!selectedAccount) {
      setTransactions([]);
      setAnalytics(null);
      return undefined;
    }
    let active = true;
    setTransactions([]);
    setAnalytics(null);
    void Promise.all([
      getTransactions(selectedAccount, { page: 0, size: 20 }),
      getAnalytics(selectedAccount),
    ])
      .then(([transactionResponse, analyticsResponse]) => {
        if (!active) return;
        setTransactions(transactionResponse.data.items);
        setAnalytics(analyticsResponse.data);
      })
      .catch((err) => {
        if (active) setError(apiError(err));
      });
    return () => {
      active = false;
    };
  }, [selectedAccount]);

  const transfer = async (
    data: Omit<Parameters<typeof createTransfer>[0], 'sourceAccountNumber'>,
  ) => {
    if (!selectedAccount) throw new Error('Select an account first.');
    try {
      await createTransfer({ ...data, sourceAccountNumber: selectedAccount });
      await refresh();
      const [transactionResponse, analyticsResponse] = await Promise.all([
        getTransactions(selectedAccount, { page: 0, size: 20 }),
        getAnalytics(selectedAccount),
      ]);
      setTransactions(transactionResponse.data.items);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      const message = apiError(err);
      setError(message);
      throw new Error(message);
    }
  };
  return (
    <DashboardContext.Provider
      value={{
        customer,
        accounts,
        cards,
        selectedAccount,
        transactions,
        analytics,
        loading,
        error,
        selectAccount: setSelectedAccount,
        refresh,
        transfer,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
export const useDashboard = () => {
  const value = useContext(DashboardContext);
  if (!value) throw new Error('useDashboard must be used within DashboardProvider');
  return value;
};
