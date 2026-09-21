import { Box, Button, Card, Container, Divider, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import LoginForm from 'components/sections/authentication/LoginForm';

const LoginPage = () => {
  return (
    <Box
      sx={{
        width: 1,
        position: 'relative',
        zIndex: 100,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: { xs: 3, sm: 5 },
              width: 1,
            }}
          >
            <Typography variant="h4">Sign In</Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: { xs: 3, sm: 5 },
                fontSize: { xs: 'subtitle1.fontSize', sm: 'body2.fontSize' },
              }}
            >
              Sign in with your customer ID and password.
            </Typography>

            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ display: 'none' }}>
              <Button fullWidth size="large" color="neutral" variant="outlined" sx={{ p: 1 }}>
                <IconifyIcon icon="eva:google-fill" color="error.main" />
              </Button>
              <Button fullWidth size="large" color="neutral" variant="outlined" sx={{ p: 1 }}>
                <IconifyIcon icon="gg:facebook" color="primary.main" width={22} />
              </Button>

              <Button fullWidth size="large" color="neutral" variant="outlined" sx={{ p: 1 }}>
                <IconifyIcon icon="logos:twitter" />
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm />
          </Card>
        </Container>
      </Stack>
    </Box>
  );
};

export default LoginPage;
