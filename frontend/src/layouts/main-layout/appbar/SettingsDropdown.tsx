import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Account, changeLoginPassword, changeTransactionPassword, getAccounts } from 'api/banking';
import { apiError } from 'api/client';
import IconifyIcon from 'components/base/IconifyIcon';
import { useThemeMode } from 'providers/ThemeModeProvider';
import { FormEvent, useEffect, useState } from 'react';

type PasswordResetType = 'LOGIN' | 'TRANSACTION';

const SettingsDropdown = () => {
  const [open, setOpen] = useState(false);
  const { mode, setMode } = useThemeMode();
  const [passwordResetType, setPasswordResetType] = useState<PasswordResetType>('LOGIN');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || passwordResetType !== 'TRANSACTION' || accounts.length) return;

    getAccounts()
      .then((response) => {
        setAccounts(response.data);
        setAccountNumber(response.data[0]?.accountNumber ?? '');
      })
      .catch((err) => setError(apiError(err)));
  }, [accounts.length, open, passwordResetType]);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setMessage(null);
  };

  const handlePasswordTypeChange = (type: PasswordResetType) => {
    setPasswordResetType(type);
    resetForm();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      const response =
        passwordResetType === 'TRANSACTION'
          ? await changeTransactionPassword({
              accountNumber,
              currentPassword,
              newPassword,
              confirmPassword,
            })
          : await changeLoginPassword({ currentPassword, newPassword, confirmPassword });
      setMessage(response.data.message || 'Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Open settings"
        sx={{ bgcolor: 'background.paper' }}
        onClick={() => setOpen(true)}
      >
        <IconifyIcon
          icon="lucide:settings"
          color="text.secondary"
          sx={{ width: { xs: 18, md: 20, xl: 25 }, height: { xs: 18, md: 20, xl: 25 } }}
        />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Stack gap={2.25} sx={{ pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={(_, checked) => setMode(checked ? 'dark' : 'light')}
                />
              }
              label="Dark theme"
            />
            <Stack component="form" id="password-settings-form" onSubmit={submit} gap={1.75}>
              <Typography variant="h6">Reset password</Typography>
              <TextField
                required
                select
                label="Password to reset"
                value={passwordResetType}
                onChange={(event) =>
                  handlePasswordTypeChange(event.target.value as PasswordResetType)
                }
              >
                <MenuItem value="LOGIN">Login password</MenuItem>
                <MenuItem value="TRANSACTION">Transaction password</MenuItem>
              </TextField>
              <Typography variant="body2" color="text.secondary">
                Use at least eight characters with an uppercase letter, number, and @, * or $.
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}
              {passwordResetType === 'TRANSACTION' && (
                <TextField
                  required
                  select
                  label="Account"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  disabled={!accounts.length}
                  helperText={!accounts.length ? 'Loading accounts…' : undefined}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.accountNumber} value={account.accountNumber}>
                      {account.accountNumber} ({account.accountType})
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                required
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <TextField
                required
                label="New password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <TextField
                required
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            type="submit"
            form="password-settings-form"
            variant="contained"
            disabled={saving || (passwordResetType === 'TRANSACTION' && !accountNumber)}
          >
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDropdown;
