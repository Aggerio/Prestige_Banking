import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import WeeklyActivity from 'components/sections/dashboard/activity/WeeklyActivity';
import BalanceHistory from 'components/sections/dashboard/balance/BalanceHistory';
import MyCards from 'components/sections/dashboard/creditCards/MyCards';
import ExpenseStatistics from 'components/sections/dashboard/expense/ExpenseStatistics';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';
import RecentTransactions from 'components/sections/dashboard/transactions/RecentTransaction';
import QuickTransfer from 'components/sections/dashboard/transfer/QuickTransfer';
import { useState } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const Dashboard = () => {
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferDone, setTransferDone] = useState(false);
  const { customer } = useDashboard();
  const panel = (delay: number) => ({
    animation: `dashboardEnter 620ms cubic-bezier(.2,.8,.2,1) ${delay}ms both`,
  });
  const completeTransfer = () => {
    setTransferOpen(false);
    setTransferDone(true);
  };
  return (
    <Box
      sx={{
        py: { xs: 2.5, md: 3.5 },
        mb: 3,
        '@keyframes dashboardEnter': {
          from: { opacity: 0, transform: 'translate3d(0,20px,0)' },
          to: { opacity: 1, transform: 'none' },
        },
        '@media (prefers-reduced-motion: reduce)': { '& *': { animation: 'none !important' } },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'end' }}
        gap={2}
        mb={{ xs: 3, md: 4 }}
        sx={panel(0)}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em', color: 'text.primary' }}
          >
            Hello{customer?.customerName ? `, ${customer.customerName}` : ''}.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
            Your accounts, activity and next move—at a glance.
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
          onClick={() => setTransferOpen(true)}
          sx={{
            alignSelf: { xs: 'start', sm: 'auto' },
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          Make a transfer
        </Button>
      </Stack>
      <Grid container spacing={{ xs: 2, sm: 2.5 }} mb={3}>
        <Grid item xs={12} xl={8} zIndex={1} sx={panel(80)}>
          <MyCards />
        </Grid>
        <Grid item xs={12} xl={4} zIndex={1} sx={panel(150)}>
          <RecentTransactions />
        </Grid>
        <Grid item xs={12} lg={8} zIndex={1} sx={panel(210)}>
          <WeeklyActivity />
        </Grid>
        <Grid item xs={12} lg={4} sx={panel(280)}>
          <ExpenseStatistics />
        </Grid>
        <Grid item xs={12} lg={6} xxl={4} zIndex={1} sx={panel(340)}>
          <QuickTransfer onSuccess={() => setTransferDone(true)} />
        </Grid>
        <Grid item xs={12} lg={6} xxl={8} zIndex={1} sx={panel(410)}>
          <BalanceHistory />
        </Grid>
        <Grid item xs={12} sx={panel(480)}>
          <InvoiceOverviewTable />
        </Grid>
      </Grid>
      <Dialog
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        fullWidth
        maxWidth="sm"
        TransitionProps={{ timeout: 260 }}
        PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}
        >
          Make a transfer
          <IconButton aria-label="Close transfer dialog" onClick={() => setTransferOpen(false)}>
            <IconifyIcon icon="solar:close-circle-linear" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <QuickTransfer onSuccess={completeTransfer} />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={transferDone}
        autoHideDuration={5000}
        onClose={() => setTransferDone(false)}
        message="Transfer sent. Your activity and balance are updating."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ sx: { bgcolor: '#173E30', color: '#F2F8F4', border: '1px solid #2E7357' } }}
      />
    </Box>
  );
};
export default Dashboard;
