import { Box, Stack, Typography } from '@mui/material';
import LoginForm from 'components/sections/authentication/LoginForm';

const LoginPage = () => (
  <Box
    className="glass-card auth-glass-card"
    sx={{
      width: 1,
      p: { xs: 3, sm: 4 },
      color: '#F4FCF7',
      boxShadow: '0 18px 50px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.16)',
    }}
  >
    <Typography sx={{ color: '#9BE6C9', font: '11px DM Mono', letterSpacing: '.13em' }}>
      SECURE ACCESS
    </Typography>
    <Typography
      sx={{
        mt: 1.5,
        fontFamily: 'Fraunces',
        fontSize: { xs: 40, sm: 48 },
        fontWeight: 500,
        letterSpacing: '-.06em',
        lineHeight: 1,
      }}
    >
      Welcome back.
    </Typography>
    <Typography sx={{ color: '#91A29A', mt: 2, mb: 4, lineHeight: 1.65 }}>
      Sign in with your customer ID and password to access your command desk.
    </Typography>
    <Box
      sx={{
        '& .MuiInputLabel-root': { color: '#91A29A' },
        '& .MuiOutlinedInput-root': {
          color: '#EEF5F1',
          bgcolor: 'rgba(9,35,25,.58)',
          backdropFilter: 'blur(12px)',
          '& fieldset': { borderColor: 'rgba(191,233,210,.3)' },
          '&:hover fieldset': { borderColor: '#6C8B7C' },
        },
        '& .MuiOutlinedInput-input': {
          color: '#EEF5F1',
          WebkitTextFillColor: '#EEF5F1',
          caretColor: '#9BE6C9',
          '&::placeholder': { color: '#789087', opacity: 1 },
          '&:-webkit-autofill': {
            WebkitTextFillColor: '#EEF5F1',
            WebkitBoxShadow: '0 0 0 100px #14201D inset',
            transition: 'background-color 9999s ease-out 0s',
          },
        },
        '& .MuiButton-contained': {
          mt: 1,
          bgcolor: '#9BE6C9',
          color: '#10251D',
          '&:hover': { bgcolor: '#C2F1DC' },
        },
      }}
    >
      <LoginForm />
    </Box>
    <Stack direction="row" gap={1} alignItems="center" mt={3}>
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#9BE6C9' }} />
      <Typography variant="caption" sx={{ color: '#91A29A' }}>
        Encrypted session · Account protection active
      </Typography>
    </Stack>
  </Box>
);
export default LoginPage;
