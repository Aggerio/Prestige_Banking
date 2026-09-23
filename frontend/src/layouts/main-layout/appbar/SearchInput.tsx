import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchInputProps {
  fullWidth: boolean;
  size: 'small' | 'medium';
}

const SearchInput = ({ fullWidth, size }: SearchInputProps) => {
  const [value, setValue] = useState('');
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const query = value.trim().toLowerCase();
    const destination = [
      { terms: ['dashboard', 'home', 'overview'], path: '/dashboard' },
      { terms: ['transaction', 'activity', 'receipt', 'transfer'], path: '/transactions' },
      { terms: ['account', 'balance', 'history', 'profile'], path: '/accounts' },
      { terms: ['card', 'credit', 'debit'], path: '/credit-cards' },
    ].find((item) => item.terms.some((term) => query.includes(term)));
    if (destination) {
      setNotFound(false);
      navigate(destination.path);
      setValue('');
    } else {
      setNotFound(Boolean(query));
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={submit}
      direction="row"
      sx={{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1,
      }}
    >
      <TextField
        fullWidth={fullWidth}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for something"
        error={notFound}
        helperText={notFound ? 'Try accounts, cards, transfers, receipts, or activity.' : undefined}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton type="submit" aria-label="Search">
                <IconifyIcon icon="mingcute:search-line" color="text.secondary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="filled"
        size={size}
        sx={{
          '& .MuiFilledInput-root': {
            borderRadius: 40,
          },
          '&::placeholder': {
            color: 'text.secondary',
          },
        }}
      />
    </Stack>
  );
};

export default SearchInput;
