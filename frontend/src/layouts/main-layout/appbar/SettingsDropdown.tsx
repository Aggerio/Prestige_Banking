import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
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
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = Boolean(confirmPassword) && newPassword === confirmPassword;
  const canSubmit =
    Boolean(currentPassword && newPassword && confirmPassword) &&
    passwordsMatch &&
    (passwordResetType !== 'TRANSACTION' || Boolean(accountNumber));

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

  const passwordAdornment = (icon: string) => (
    <InputAdornment position="start">
      <IconifyIcon icon={icon} color="text.secondary" />
    </InputAdornment>
  );

  return (
    <>
      <IconButton
        aria-label="Open settings"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform .25s ease, box-shadow .25s ease',
          '&:hover': { transform: 'rotate(18deg)', boxShadow: 3 },
        }}
      >
        <IconifyIcon
          icon="lucide:settings"
          color="text.secondary"
          sx={{ width: { xs: 18, md: 20, xl: 25 }, height: { xs: 18, md: 20, xl: 25 } }}
        />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 28px 80px rgba(10,47,33,.24)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            color: '#FFFFFF',
            background: 'linear-gradient(135deg, #0F4D37, #178A68)',
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
            <Stack direction="row" gap={1.75} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2.25,
                  bgcolor: 'rgba(255,255,255,.14)',
                  border: '1px solid rgba(255,255,255,.22)',
                }}
              >
                <IconifyIcon icon="solar:settings-bold-duotone" width={25} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Settings</Typography>
                <Typography sx={{ mt: 0.25, color: 'rgba(255,255,255,.72)', fontSize: 13 }}>
                  Appearance and account security
                </Typography>
              </Box>
            </Stack>
            <IconButton
              aria-label="Close settings"
              onClick={() => setOpen(false)}
              sx={{ color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.1)' }}
            >
              <IconifyIcon icon="solar:close-circle-linear" width={23} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2.25, sm: 3 }, bgcolor: 'background.default' }}>
          <Stack gap={2.5}>
            <Box
              sx={{
                p: 2.25,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                labelPlacement="start"
                sx={{ m: 0, width: 1, justifyContent: 'space-between', gap: 2 }}
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={(_, checked) => setMode(checked ? 'dark' : 'light')}
                  />
                }
                label={
                  <Stack direction="row" gap={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      }}
                    >
                      <IconifyIcon
                        icon={mode === 'dark' ? 'solar:moon-bold' : 'solar:sun-2-bold'}
                        width={21}
                      />
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>Dark theme</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use a darker interface in low light.
                      </Typography>
                    </Box>
                  </Stack>
                }
              />
            </Box>

            <Box
              component="form"
              id="password-settings-form"
              onSubmit={submit}
              sx={{
                p: { xs: 2.25, sm: 3 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" gap={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    bgcolor: 'rgba(23,138,104,.12)',
                    color: '#178A68',
                  }}
                >
                  <IconifyIcon icon="solar:lock-password-bold-duotone" width={23} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Reset password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose which credential you want to update.
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  mt: 2.5,
                  p: 0.5,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 0.75,
                  borderRadius: 2.5,
                  bgcolor: 'action.hover',
                }}
              >
                {(['LOGIN', 'TRANSACTION'] as const).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    onClick={() => handlePasswordTypeChange(type)}
                    variant={passwordResetType === type ? 'contained' : 'text'}
                    startIcon={
                      <IconifyIcon
                        icon={type === 'LOGIN' ? 'solar:user-circle-bold' : 'solar:card-bold'}
                      />
                    }
                    sx={{
                      minHeight: 42,
                      px: 1,
                      color: passwordResetType === type ? '#FFFFFF' : 'text.secondary',
                      boxShadow: passwordResetType === type ? 2 : 'none',
                    }}
                  >
                    {type === 'LOGIN' ? 'Login' : 'Transaction'}
                  </Button>
                ))}
              </Box>

              <Stack gap={2} mt={2.5}>
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
                    helperText={
                      !accounts.length
                        ? 'Loading accounts…'
                        : 'Select the account linked to this password.'
                    }
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
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  InputProps={{ startAdornment: passwordAdornment('solar:lock-linear') }}
                />
                <TextField
                  required
                  label="New password"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  InputProps={{
                    startAdornment: passwordAdornment('solar:key-linear'),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                          onClick={() => setShowPasswords((visible) => !visible)}
                        >
                          <IconifyIcon
                            icon={showPasswords ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  label="Confirm new password"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  error={Boolean(confirmPassword) && !passwordsMatch}
                  helperText={
                    confirmPassword && !passwordsMatch ? 'Passwords do not match.' : undefined
                  }
                  InputProps={{
                    startAdornment: passwordAdornment('solar:check-circle-linear'),
                  }}
                />

                <Box sx={{ p: 1.75, borderRadius: 2.25, bgcolor: 'action.hover' }}>
                  <Stack direction="row" gap={1} alignItems="flex-start">
                    <IconifyIcon icon="solar:shield-check-linear" width={19} color="#178A68" />
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      Use at least eight characters with an uppercase letter, a number, and one of
                      @, * or $.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: { xs: 2.25, sm: 3 }, py: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="password-settings-form"
            variant="contained"
            disabled={saving || !canSubmit}
            startIcon={<IconifyIcon icon="solar:shield-check-bold" />}
            sx={{
              px: 2.5,
              bgcolor: '#178A68',
              '&:hover': { bgcolor: '#126F55' },
              '&.Mui-disabled': {
                color: mode === 'dark' ? '#B8CBC1' : '#61736A',
                bgcolor: mode === 'dark' ? 'rgba(23,138,104,.26)' : '#DCE7E1',
                border: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(155,230,201,.18)' : 'rgba(18,87,62,.12)',
              },
            }}
          >
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDropdown;
