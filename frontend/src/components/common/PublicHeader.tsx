import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Logo from 'components/common/Logo';
import { Link as RouterLink } from 'react-router-dom';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Investors', to: '/investors' },
  { label: 'Offers', to: '/offers' },
  { label: 'Contact Us', to: '/contact-us' },
];

const PublicHeader = () => (
  <Container maxWidth="xl">
    <Stack
      component="header"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={{ xs: 2, md: 3 }}
      py={2.75}
      sx={{ pr: 1, overflow: 'visible' }}
    >
      <Box
        component={RouterLink}
        to="/"
        aria-label="Prestige Banking home"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'common.white',
          textDecoration: 'none',
        }}
      >
        <Logo light />
      </Box>

      <Stack
        component="nav"
        aria-label="Public navigation"
        direction="row"
        alignItems="center"
        justifyContent={{ xs: 'flex-start', md: 'center' }}
        gap={{ xs: 0.5, sm: 1, lg: 2 }}
        sx={{
          order: { xs: 3, md: 2 },
          width: { xs: 1, md: 'auto' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {publicLinks.map((item) => (
          <Button
            key={item.to}
            component={RouterLink}
            to={item.to}
            color="inherit"
            sx={{
              flexShrink: 0,
              minWidth: 0,
              px: { xs: 1, sm: 1.5 },
              color: '#AABBB2',
              fontWeight: 500,
              '&:hover': { color: '#EAF5EF', bgcolor: 'rgba(155,230,201,.06)' },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Stack
        direction="row"
        gap={{ xs: 1, sm: 3 }}
        alignItems="center"
        sx={{ order: { xs: 2, md: 3 }, flexShrink: 0 }}
      >
        <Typography variant="body2" sx={{ display: { xs: 'none', xl: 'block' }, color: '#8FA299' }}>
          Personal banking
        </Typography>
        <Button
          component={RouterLink}
          to="/authentication/login"
          variant="outlined"
          sx={{
            color: '#B8D4C7',
            borderColor: '#456156',
            flexShrink: 0,
            '&:hover': { borderColor: '#A8E6CB', bgcolor: 'rgba(155,230,201,.06)' },
          }}
        >
          Sign in
        </Button>
      </Stack>
    </Stack>
  </Container>
);

export default PublicHeader;
