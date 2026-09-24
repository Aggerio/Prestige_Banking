import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import BalanceHistory from 'components/sections/dashboard/balance/BalanceHistory';
import { currencyFormat } from 'helpers/utils';
import { useDashboard } from 'providers/DashboardProvider';

const AccountsPage = () => {
  const { customer, accounts } = useDashboard();
  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 } }}>
      <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em' }}>
        Account details
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={4}>
        Review account balances, history, and profile details.
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h5">Profile and accounts</Typography>
            <Grid container spacing={2} mt={1}>
              {[
                ['Customer name', customer?.customerName || '—'],
                ['Account status', customer?.status || '—'],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography fontWeight={700} mt={0.35}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={2} mt={2}>
              {accounts.map((account) => (
                <Grid item xs={12} md={6} key={account.accountNumber}>
                  <Box
                    sx={{
                      height: 1,
                      p: { xs: 2, md: 2.5 },
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" gap={2} mb={2}>
                      <Box>
                        <Typography fontWeight={800}>{account.accountType} account</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.accountNumber}
                        </Typography>
                      </Box>
                      <Typography fontWeight={800}>{currencyFormat(account.balance)}</Typography>
                    </Stack>
                    <Grid container spacing={1.5}>
                      {[
                        ['Bank name', customer?.bank?.bankName],
                        ['IFSC code', customer?.bank?.ifscCode],
                        ['Branch', customer?.bank?.branchName],
                        ['Status', account.status],
                        ['Transfer limit', currencyFormat(account.transferLimit)],
                        ['Minimum balance', currencyFormat(account.minimumBalance)],
                      ].map(([label, value]) => (
                        <Grid item xs={6} key={label}>
                          <Typography variant="caption" color="text.secondary">
                            {label}
                          </Typography>
                          <Typography variant="body2" fontWeight={700} mt={0.25}>
                            {value || '—'}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <BalanceHistory />
        </Grid>
      </Grid>
    </Box>
  );
};
export default AccountsPage;
