import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import { getInvestors, getPublicHome, PublicContent, PublicHome } from 'api/banking';
import { apiError } from 'api/client';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ContentCard = ({ content, icon }: { content: PublicContent; icon: string }) => (
  <Card sx={{ height: 1, p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'primary.lighter', color: 'primary.main' }}>
        <IconifyIcon icon={icon} width={24} />
      </Box>
      {content.imageUrl && (
        <Box
          component="img"
          src={content.imageUrl}
          alt=""
          sx={{ width: 48, height: 48, objectFit: 'contain' }}
        />
      )}
    </Stack>
    <Typography variant="h5" color="primary.darker">
      {content.title}
    </Typography>
    <Typography color="text.secondary" sx={{ lineHeight: 1.7, flexGrow: 1 }}>
      {content.contentBody}
    </Typography>
  </Card>
);

const PublicHomePage = () => {
  const [home, setHome] = useState<PublicHome | null>(null);
  const [investors, setInvestors] = useState<PublicContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([getPublicHome(), getInvestors()])
      .then(([homeResponse, investorResponse]) => {
        setHome(homeResponse.data);
        setInvestors(investorResponse.data);
      })
      .catch((err) => setError(apiError(err)));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'primary.darker' }}>
      <Container maxWidth="xl">
        <Stack
          component="header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={3}
        >
          <Logo />
          <Button component={RouterLink} to="/authentication/login" variant="contained">
            Sign in
          </Button>
        </Stack>
      </Container>

      <Box sx={{ bgcolor: 'primary.darker', color: 'common.white', overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ color: 'primary.lighter', letterSpacing: 2 }}>
                PRESTIGE DIGITAL BANKING
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: 'h2.fontSize', md: 'h1.fontSize' },
                  fontWeight: 700,
                  lineHeight: 1.12,
                }}
              >
                Banking that keeps pace with your life.
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 620,
                  color: 'primary.lighter',
                  fontSize: { xs: 'body1.fontSize', md: 'h6.fontSize' },
                }}
              >
                {home?.welcomeMessage ||
                  'Simple accounts, secure transfers, and clear financial choices in one place.'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mt={4}>
                <Button
                  component={RouterLink}
                  to="/authentication/login"
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  Access your account
                </Button>
                <Button
                  component={RouterLink}
                  to="#offers"
                  size="large"
                  variant="outlined"
                  sx={{ color: 'common.white', borderColor: 'primary.lighter' }}
                >
                  Explore offers
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'common.white',
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: 'none',
                }}
              >
                <IconifyIcon icon="solar:shield-check-bold" width={42} />
                <Typography variant="h4" mt={2}>
                  Secure by design
                </Typography>
                <Typography mt={1.5} sx={{ color: 'primary.lighter', lineHeight: 1.7 }}>
                  Your accounts, cards, statements, and transactions are always a few clear steps
                  away.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        {!home && !error && (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        )}
        <Box id="offers" sx={{ scrollMarginTop: 24 }}>
          <Typography variant="h3">Offers worth a closer look</Typography>
          <Typography color="text.secondary" mt={1}>
            Current opportunities from {home?.bankName || 'Prestige Banking'}.
          </Typography>
          <Grid container spacing={3} mt={1}>
            {home?.offers.map((offer) => (
              <Grid item xs={12} md={4} key={offer.contentId}>
                <ContentCard content={offer} icon="solar:tag-price-bold" />
              </Grid>
            ))}
            {home && !home.offers.length && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No offers are available right now.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box mt={{ xs: 7, md: 10 }}>
          <Typography variant="h3">Investment opportunities</Typography>
          <Typography color="text.secondary" mt={1}>
            Explore the investment updates published by our public-info service.
          </Typography>
          <Grid container spacing={3} mt={1}>
            {investors.map((investment) => (
              <Grid item xs={12} md={4} key={investment.contentId}>
                <ContentCard content={investment} icon="solar:chart-2-bold" />
              </Grid>
            ))}
            {home && !investors.length && (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  No investment updates are available right now.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicHomePage;
