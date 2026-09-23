import { Grid, Stack, Typography } from '@mui/material';
import WeeklyActivity from 'components/sections/dashboard/activity/WeeklyActivity';
import ExpenseStatistics from 'components/sections/dashboard/expense/ExpenseStatistics';
import QuickTransfer from 'components/sections/dashboard/transfer/QuickTransfer';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';

const TransactionsPage = () => {
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
