import CardContainer from 'components/common/CardContainter';
import IconifyIcon from 'components/base/IconifyIcon';
import { Alert, Button, Grid, Stack, TextField } from '@mui/material';
import { useDashboard } from 'providers/DashboardProvider';
import { FormEvent, useState } from 'react';

interface QuickTransferProps {
  onSuccess?: () => void;
}

const QuickTransfer = ({ onSuccess }: QuickTransferProps) => {
  const { selectedAccount, transfer } = useDashboard();
  const [destinationAccountNumber, setDestinationAccountNumber] = useState('');
  const [destinationAccountHolderName, setDestinationAccountHolderName] = useState('');
  const [destinationIfscCode, setDestinationIfscCode] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !destinationAccountNumber ||
      !destinationAccountHolderName ||
      !destinationIfscCode ||
      !transactionPassword
    ) {
      setError('Complete all transfer fields.');
      return;
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await transfer({
        destinationAccountNumber,
        destinationAccountHolderName,
        destinationIfscCode,
        amount: Number(amount),
        transactionPassword,
      });
      setAmount('');
      setTransactionPassword('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <CardContainer title="Quick Transfer">
      <Stack component="form" onSubmit={submit} gap={2} sx={{ flex: 1, pt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="From Account"
              value={selectedAccount || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Account Number"
              value={destinationAccountNumber}
              onChange={(event) => setDestinationAccountNumber(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Recipient Name"
              value={destinationAccountHolderName}
              onChange={(event) => setDestinationAccountHolderName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="IFSC Code"
              value={destinationIfscCode}
              onChange={(event) => setDestinationIfscCode(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              size="small"
              label="Amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              size="small"
              label="Transaction Password"
              type="password"
              value={transactionPassword}
              onChange={(event) => setTransactionPassword(event.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || !selectedAccount}
          endIcon={<IconifyIcon icon="ph:telegram-logo" color="common.white" />}
        >
          Send
        </Button>
      </Stack>
    </CardContainer>
  );
};

export default QuickTransfer;
