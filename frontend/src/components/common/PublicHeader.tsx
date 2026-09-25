import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Logo from 'components/common/Logo';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const publicLinks = [
  // Keep the header navigation aligned with every public route in the router.
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Investors', to: '/investors' },
  { label: 'Offers', to: '/offers' },
  { label: 'Contact Us', to: '/contact-us' },
];

const PublicHeader = () => {
  const navigate = useNavigate();
  const navigateWithTransition = (to: string) => {
    // Use the browser transition when available, while retaining ordinary navigation everywhere else.
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => unknown;
    };

    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(() => navigate(to));
      return;
    }
    navigate(to);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: '#0F4D37',
        borderBottom: '1px solid #2C7657',
        boxShadow: '0 5px 18px rgba(11, 62, 42, .16)',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={{ xs: 2, md: 3 }}
          py={{ xs: 1.5, md: 1.75 }}
          sx={{ pr: 1, overflow: 'visible' }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => navigateWithTransition('/')}
            aria-label="Prestige Banking home"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'common.white',
              textDecoration: 'none',
              border: 0,
              bgcolor: 'transparent',
              cursor: 'pointer',
              p: 0,
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
                onClick={() => navigateWithTransition(item.to)}
                color="inherit"
                sx={{
                  flexShrink: 0,
                  minWidth: 0,
                  px: { xs: 1, sm: 1.5 },
                  color: '#E3F5EB',
                  fontWeight: 500,
                  '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,.14)' },
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
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', xl: 'block' }, color: '#CAE8D8' }}
            >
              Personal banking
            </Typography>
            <Button
              component={RouterLink}
              to="/authentication/login"
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(220,255,236,.58)',
                flexShrink: 0,
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.14)' },
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default PublicHeader;
