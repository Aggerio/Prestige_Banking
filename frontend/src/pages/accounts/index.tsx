import { Alert, Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { apiError } from 'api/client';
import { changeLoginPassword } from 'api/banking';
import BalanceHistory from 'components/sections/dashboard/balance/BalanceHistory';
import { FormEvent, useState } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const AccountsPage = () => {
  const { customer, accounts } = useDashboard();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await changeLoginPassword({ currentPassword, newPassword });
      setMessage(response.data.message || 'Login password changed. Please sign in again.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 } }}>
      <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main' }}>
        PERSONAL PROFILE / SECURITY
      </Typography>
      <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em', mt: 1 }}>
        Account details
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={4}>
        Review account balances, history, profile details, and sign-in security.
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h5">Profile and accounts</Typography>
            <Grid container spacing={2} mt={1}>
              {[
                ['Customer name', customer?.customerName || '—'],
                ['Customer ID', customer?.customerId || '—'],
                ['Account status', customer?.status || '—'],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={4} key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography fontWeight={700} mt={0.35}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Stack gap={1.5} mt={4}>
              {accounts.map((account) => (
                <Stack
                  key={account.accountNumber}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 1.5, borderTop: 1, borderColor: 'divider' }}
                >
                  <Box>
                    <Typography fontWeight={700}>{account.accountType}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {account.accountNumber}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontWeight={700}>₹ {account.balance.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Limit ₹ {account.transferLimit.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <BalanceHistory />
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card component="form" onSubmit={submit} sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h5">Reset login password</Typography>
            <Typography variant="body2" color="text.secondary" mt={1} mb={3}>
              Use your current password to create a new secure sign-in.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            <Stack gap={2}>
              <TextField
                required
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                required
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Use a password you have not used before."
              />
              <Button
                type="submit"
                variant="contained"
                disabled={saving || !currentPassword || !newPassword}
              >
                {saving ? 'Updating password…' : 'Update password'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default AccountsPage;
