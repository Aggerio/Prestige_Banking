import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import WeeklyActivity from 'components/sections/dashboard/activity/WeeklyActivity';
import BalanceHistory from 'components/sections/dashboard/balance/BalanceHistory';
import MyCards from 'components/sections/dashboard/creditCards/MyCards';
import ExpenseStatistics from 'components/sections/dashboard/expense/ExpenseStatistics';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';
import RecentTransactions from 'components/sections/dashboard/transactions/RecentTransaction';
import QuickTransfer from 'components/sections/dashboard/transfer/QuickTransfer';

const Dashboard = () => {
  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 }, mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'end' }}
        gap={2}
        mb={{ xs: 3, md: 4 }}
      >
        <Box>
          <Typography
            sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main', mb: 1 }}
          >
            MONDAY, 22 SEPTEMBER
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em', color: 'text.primary' }}
          >
            Good afternoon.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
            Your accounts, activity and next move—at a glance.
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
          sx={{ alignSelf: { xs: 'start', sm: 'auto' } }}
        >
          Make a transfer
        </Button>
      </Stack>
      <Grid container spacing={{ xs: 2, sm: 2.5 }} mb={3}>
        {/* ------------- Card section ---------------- */}
        <Grid item xs={12} xl={8} zIndex={1}>
          <MyCards />
        </Grid>
        <Grid item xs={12} xl={4} zIndex={1}>
          <RecentTransactions />
        </Grid>

        {/* ------------- Chart section ---------------- */}
        <Grid item xs={12} lg={8} zIndex={1}>
          <WeeklyActivity />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ExpenseStatistics />
        </Grid>

        {/* ------------- Slider section ---------------- */}
        <Grid item xs={12} lg={6} xxl={4} zIndex={1}>
          <QuickTransfer />
        </Grid>
        <Grid item xs={12} lg={6} xxl={8} zIndex={1}>
          <BalanceHistory />
        </Grid>

        {/* ------------- Data-Grid section ---------------- */}
        <Grid item xs={12}>
          <InvoiceOverviewTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
