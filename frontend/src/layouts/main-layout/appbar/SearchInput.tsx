import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from 'providers/DashboardProvider';

interface SearchInputProps {
  fullWidth: boolean;
  size: 'small' | 'medium';
}

interface SearchResult {
  id: string;
  title: string;
  detail: string;
  icon: string;
  path: string;
  terms: string[];
}

const pageResults: SearchResult[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    detail: 'Your banking overview',
    icon: 'solar:home-2-linear',
    path: '/dashboard',
    terms: ['home', 'overview', 'summary'],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    detail: 'Transfers, activity and receipts',
    icon: 'solar:transfer-horizontal-linear',
    path: '/transactions',
    terms: ['transaction', 'transactions', 'activity', 'transfer', 'receipt', 'payments'],
  },
  {
    id: 'accounts',
    title: 'Accounts',
    detail: 'Balances and account history',
    icon: 'solar:wallet-money-linear',
    path: '/accounts',
    terms: ['account', 'accounts', 'balance', 'history', 'profile'],
  },
  {
    id: 'cards',
    title: 'Cards',
    detail: 'Manage your debit and credit cards',
    icon: 'solar:card-linear',
    path: '/credit-cards',
    terms: ['card', 'cards', 'credit', 'debit'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    detail: 'Review account updates and alerts',
    icon: 'solar:bell-linear',
    path: '/notifications',
    terms: ['notification', 'notifications', 'alert', 'alerts', 'message', 'messages'],
  },
];

const matches = (query: string, result: SearchResult) => {
  const searchable = [result.title, result.detail, ...result.terms].join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => searchable.includes(term));
};

const SearchInput = ({ fullWidth, size }: SearchInputProps) => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { accounts, cards, transactions } = useDashboard();

  const results = useMemo(() => {
    const query = value.trim();
    const accountResults: SearchResult[] = accounts.map((account) => ({
      id: `account-${account.accountNumber}`,
      title: account.accountType || 'Bank account',
      detail: `Account ending ${account.accountNumber.slice(-4)}`,
      icon: 'solar:wallet-money-linear',
      path: '/accounts',
      terms: [account.accountNumber, account.accountType || '', 'account', 'balance'],
    }));
    const cardResults: SearchResult[] = cards.map((card) => ({
      id: `card-${card.cardId}`,
      title: card.cardType ? `${card.cardType} card` : 'Bank card',
      detail: `Card ending ${card.maskedPan.slice(-4)}`,
      icon: 'solar:card-linear',
      path: '/credit-cards',
      terms: [card.maskedPan, card.cardType || '', 'card'],
    }));
    const transactionResults: SearchResult[] = transactions.map((transaction) => ({
      id: `transaction-${transaction.referenceNumber}`,
      title: transaction.remarks || 'Transaction',
      detail: `₹${transaction.amount} · ${transaction.referenceNumber}`,
      icon: 'solar:transfer-horizontal-linear',
      path: `/transactions?reference=${encodeURIComponent(transaction.referenceNumber)}`,
      terms: [
        transaction.referenceNumber,
        transaction.remarks || '',
        transaction.transactionType || '',
        'transaction',
        'transfer',
      ],
    }));

    const allResults = [...pageResults, ...accountResults, ...cardResults, ...transactionResults];
    return query ? allResults.filter((result) => matches(query, result)).slice(0, 7) : pageResults;
  }, [accounts, cards, transactions, value]);

  const selectResult = (result: SearchResult) => {
    navigate(result.path);
    setValue('');
    setIsOpen(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (results[0]) {
      selectResult(results[0]);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Stack
        component="form"
        onSubmit={submit}
        direction="row"
        sx={{ position: 'relative', alignItems: 'center', justifyContent: 'center', width: 1 }}
      >
        <TextField
          fullWidth={fullWidth}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search accounts, cards, transfers..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="solar:magnifer-linear" color="text.secondary" />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear search"
                  edge="end"
                  size="small"
                  onClick={() => {
                    setValue('');
                    setIsOpen(true);
                  }}
                >
                  <IconifyIcon icon="solar:close-circle-linear" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
          variant="filled"
          size={size}
          sx={{
            '& .MuiFilledInput-root': { borderRadius: 40 },
            '&::placeholder': { color: 'text.secondary' },
          }}
        />

        {isOpen && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              zIndex: (theme) => theme.zIndex.modal,
              width: '100%',
              minWidth: 280,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              boxShadow: (theme) => theme.shadows[8],
            }}
          >
            <Box px={2} pt={1.5} pb={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                {value.trim() ? 'SEARCH RESULTS' : 'QUICK ACCESS'}
              </Typography>
            </Box>
            {results.length ? (
              <List disablePadding>
                {results.map((result) => (
                  <ListItemButton
                    key={result.id}
                    onClick={() => selectResult(result)}
                    sx={{ py: 1.1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 38 }}>
                      <IconifyIcon icon={result.icon} fontSize={21} color="primary.main" />
                    </ListItemIcon>
                    <ListItemText
                      primary={result.title}
                      secondary={result.detail}
                      primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Box px={2} py={2.5}>
                <Typography variant="body2" color="text.secondary">
                  No matching result found. Try a page, account, card or transfer reference.
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Stack>
    </ClickAwayListener>
  );
};

export default SearchInput;
