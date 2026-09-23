import { Alert, Card, Grid, Stack, Typography } from '@mui/material';
import { getTransfer, TransferDetails } from 'api/banking';
import WeeklyActivity from 'components/sections/dashboard/activity/WeeklyActivity';
import ExpenseStatistics from 'components/sections/dashboard/expense/ExpenseStatistics';
import QuickTransfer from 'components/sections/dashboard/transfer/QuickTransfer';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TransactionsPage = () => {
  const [params] = useSearchParams();
  const reference = params.get('reference');
  const [transfer, setTransfer] = useState<TransferDetails | null>(null);
  const [detailError, setDetailError] = useState(false);
  useEffect(() => {
    if (!reference) {
      setTransfer(null);
      setDetailError(false);
      return;
    }
    void getTransfer(reference)
      .then((response) => {
        setTransfer(response.data);
        setDetailError(false);
      })
      .catch(() => {
        setTransfer(null);
        setDetailError(true);
      });
  }, [reference]);
  return (
    <Stack sx={{ minHeight: 'calc(100vh - 180px)', py: { xs: 2.5, md: 3.5 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
        alignItems={{ sm: 'end' }}
      >
        <Stack gap={0.75}>
          <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main' }}>
            MONEY MOVEMENT / RECORD
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em' }}>
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Move money, review your cash flow, and inspect the full activity ledger.
          </Typography>
        </Stack>
      </Stack>
      {transfer && (
        <Card
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: 3,
            border: 1,
            borderColor: 'primary.lighter',
            boxShadow: 'none',
          }}
        >
          <Typography variant="overline" color="primary.main">
            TRANSFER DETAILS
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 4 }} mt={0.75}>
            <Typography>
              <strong>Reference:</strong> {transfer.referenceNumber}
            </Typography>
            <Typography>
              <strong>Status:</strong> {transfer.status}
            </Typography>
            <Typography>
              <strong>Amount:</strong> ₹{transfer.amount.toLocaleString('en-IN')}
            </Typography>
            <Typography>
              <strong>Completed:</strong> {new Date(transfer.completedAt).toLocaleString()}
            </Typography>
          </Stack>
        </Card>
      )}
      {detailError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          This transfer could not be found for your account.
        </Alert>
      )}
      <Grid container spacing={{ xs: 2, md: 2.5 }} mt={{ xs: 1, md: 2 }}>
        <Grid item xs={12} xl={5}>
          <QuickTransfer />
        </Grid>
        <Grid item xs={12} xl={7}>
          <WeeklyActivity />
        </Grid>
        <Grid item xs={12}>
          <ExpenseStatistics />
        </Grid>
        <Grid item xs={12}>
          <InvoiceOverviewTable />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TransactionsPage;
