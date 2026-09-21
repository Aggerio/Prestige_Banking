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
import ShaderBackdrop from 'components/common/ShaderBackdrop';
import { getInvestors, getPublicHome, PublicContent, PublicHome } from 'api/banking';
import { apiError } from 'api/client';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const BankingPhone = () => (
  <Box
    aria-label="Preview of the digital banking experience"
    sx={{
      position: 'relative',
      mx: 'auto',
      width: { xs: 280, sm: 320 },
      height: { xs: 500, sm: 560 },
      p: 1,
      borderRadius: 8,
      bgcolor: '#05051c',
      boxShadow: '0 38px 90px rgba(0, 0, 0, .48), inset 0 0 0 1px rgba(255,255,255,.22)',
      transform: { md: 'rotate(5deg)' },
      animation: 'phoneFloat 5.5s ease-in-out infinite',
      '@keyframes phoneFloat': {
        '0%, 100%': { translate: '0 0' },
        '50%': { translate: '0 -12px' },
      },
      '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        left: '50%',
        translate: '-50%',
        width: 96,
        height: 22,
        borderRadius: 4,
        bgcolor: '#05051c',
        zIndex: 2,
      }}
    />
    <Stack
      sx={{
        height: 1,
        p: { xs: 2.25, sm: 2.75 },
        borderRadius: 6.5,
        bgcolor: '#f7f7fc',
        color: '#171532',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
        <Stack direction="row" gap={1} alignItems="center">
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: 1.75,
              background: 'linear-gradient(135deg, #3614dc, #8d31f5)',
            }}
          />
          <Typography fontWeight={700}>Hey, Aarav</Typography>
        </Stack>
        <IconifyIcon icon="solar:bell-bing-bold" color="#3115d8" width={21} />
      </Stack>
      <Box
        sx={{
          mt: 3.25,
          p: 2.25,
          borderRadius: 4,
          color: 'common.white',
          background: 'linear-gradient(135deg, #19046d 0%, #4521dc 58%, #832dee 100%)',
          boxShadow: '0 16px 30px rgba(51, 26, 183, .25)',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          AVAILABLE BALANCE
        </Typography>
        <Typography variant="h3" mt={0.5}>
          ₹65,000
        </Typography>
        <Stack direction="row" justifyContent="space-between" mt={2.5}>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            •••• 1001
          </Typography>
          <IconifyIcon icon="solar:card-bold" width={22} />
        </Stack>
      </Box>
      <Typography fontWeight={700} mt={3}>
        Quick actions
      </Typography>
      <Stack direction="row" gap={1.25} mt={1.5}>
        {[
          ['solar:arrow-right-up-bold', 'Send'],
          ['solar:receipt-text-bold', 'Pay'],
          ['solar:chart-2-bold', 'Invest'],
        ].map(([icon, label]) => (
          <Stack key={label} alignItems="center" gap={0.5} sx={{ flex: 1 }}>
            <Box sx={{ p: 1.1, borderRadius: 2.5, bgcolor: '#ebe8ff', color: '#3717db' }}>
              <IconifyIcon icon={icon} width={20} />
            </Box>
            <Typography variant="caption">{label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Typography fontWeight={700} mt={3}>
        Recent activity
      </Typography>
      <Stack gap={1.25} mt={1.25}>
        {[
          ['K', 'Kabir Singh', '+ ₹2,500', '#0eac88'],
          ['N', 'Netflix', '- ₹649', '#e0526a'],
        ].map(([initial, name, value, color]) => (
          <Stack key={name} direction="row" alignItems="center" gap={1.25}>
            <Box
              sx={{
                width: 34,
                height: 34,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: '#e8e8f2',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {initial}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Today
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} sx={{ color }}>
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  </Box>
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

      <Box
        sx={{
          position: 'relative',
          color: 'common.white',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        <ShaderBackdrop />
        <Box
          sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(5, 10, 49, 0.22)', zIndex: -1 }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 8, md: 12 } }}>
          <Grid container spacing={{ xs: 6, md: 5 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack direction="row" alignItems="center" gap={1.25}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    boxShadow: '0 0 18px rgba(17, 215, 156, .9)',
                  }}
                />
                <Typography variant="overline" sx={{ color: 'primary.lighter', letterSpacing: 2 }}>
                  PRESTIGE DIGITAL BANKING
                </Typography>
              </Stack>
              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: 'h2.fontSize', md: 'h1.fontSize' },
                  fontWeight: 700,
                  lineHeight: 1.12,
                }}
              >
                Banking that feels as fast as you are.
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
                  component="a"
                  href="#offers"
                  size="large"
                  variant="outlined"
                  sx={{ color: 'common.white', borderColor: 'primary.lighter' }}
                >
                  Explore offers
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative', py: { xs: 0, md: 2 } }}>
                <Box
                  sx={{
                    position: 'absolute',
                    width: 210,
                    height: 210,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    filter: 'blur(64px)',
                    opacity: 0.4,
                    top: 80,
                    right: '15%',
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <BankingPhone />
                </Box>
                <Card
                  sx={{
                    position: 'absolute',
                    left: { xs: -10, md: -30 },
                    bottom: { xs: 20, md: 44 },
                    p: 1.6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,.16)',
                    color: 'common.white',
                    border: '1px solid rgba(255,255,255,.28)',
                    backdropFilter: 'blur(12px)',
                    animation: 'tagFloat 4.5s ease-in-out infinite',
                    '@keyframes tagFloat': {
                      '0%,100%': { translate: '0 0' },
                      '50%': { translate: '0 8px' },
                    },
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                  }}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <IconifyIcon icon="solar:verified-check-bold" width={22} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        TRANSFER COMPLETE
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        Sent instantly
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Box>
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
        <Card
          sx={{
            mt: { xs: -2, md: -5 },
            position: 'relative',
            zIndex: 1,
            borderRadius: 4,
            p: { xs: 2, md: 2.5 },
            boxShadow: '0 18px 45px rgba(41, 25, 125, .10)',
          }}
        >
          <Grid container>
            {[
              ['solar:bolt-bold', 'Instant by default', 'Move money in seconds'],
              ['solar:shield-check-bold', 'Always protected', 'Security at every step'],
              ['solar:chart-square-bold', 'Clarity, not clutter', 'Your money in focus'],
            ].map(([icon, title, body], index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={title}
                sx={{ borderLeft: { md: index ? 1 : 0 }, borderColor: 'divider' }}
              >
                <Stack
                  direction="row"
                  gap={1.5}
                  px={{ md: 2 }}
                  py={{ xs: 1.25, md: 0 }}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                    }}
                  >
                    <IconifyIcon icon={icon} width={20} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {body}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Box id="offers" sx={{ scrollMarginTop: 24, mt: { xs: 7, md: 10 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'end' }}
            gap={2}
          >
            <Box>
              <Typography variant="overline" color="secondary.main" letterSpacing={2}>
                CURATED FOR YOU
              </Typography>
              <Typography variant="h2" color="primary.darker">
                Offers with real momentum.
              </Typography>
            </Box>
            <Typography color="text.secondary" maxWidth={330}>
              Current opportunities from {home?.bankName || 'Prestige Banking'}, chosen to make your
              next move simpler.
            </Typography>
          </Stack>
          <Grid container spacing={2.5} mt={1}>
            {home?.offers.map((offer, index) => (
              <Grid item xs={12} md={index === 0 ? 7 : 5} key={offer.contentId}>
                <Card
                  sx={{
                    minHeight: { md: 260 },
                    p: { xs: 3, md: 4 },
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: 'relative',
                    color: index === 0 ? 'common.white' : 'primary.darker',
                    background:
                      index === 0
                        ? 'linear-gradient(135deg, #160850 0%, #3817c8 58%, #902be8 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f0efff 100%)',
                    boxShadow: index === 0 ? '0 22px 50px rgba(57, 25, 197, .24)' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 220,
                      height: 220,
                      borderRadius: '50%',
                      right: -75,
                      top: -85,
                      bgcolor: index === 0 ? 'rgba(255,255,255,.12)' : 'primary.lighter',
                    }}
                  />
                  <Stack position="relative" sx={{ height: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2.5,
                          bgcolor: index === 0 ? 'rgba(255,255,255,.14)' : 'primary.lighter',
                          color: index === 0 ? 'common.white' : 'primary.main',
                        }}
                      >
                        <IconifyIcon icon="solar:tag-price-bold" width={25} />
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.75 }}>
                        FEATURED OFFER
                      </Typography>
                    </Stack>
                    <Typography variant="h4" mt={4}>
                      {offer.title}
                    </Typography>
                    <Typography mt={1.25} sx={{ lineHeight: 1.7, opacity: index === 0 ? 0.78 : 1 }}>
                      {offer.contentBody}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/authentication/login"
                      endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
                      sx={{
                        mt: 'auto',
                        alignSelf: 'start',
                        px: 0,
                        color: index === 0 ? 'common.white' : 'primary.main',
                      }}
                    >
                      Discover more
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
            {home && !home.offers.length && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No offers are available right now.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box
          mt={{ xs: 8, md: 12 }}
          p={{ xs: 3, md: 5 }}
          borderRadius={6}
          sx={{
            bgcolor: '#09072a',
            color: 'common.white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 380,
              height: 380,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              filter: 'blur(110px)',
              opacity: 0.38,
              right: -160,
              bottom: -210,
            }}
          />
          <Stack
            position="relative"
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            gap={3}
          >
            <Box maxWidth={530}>
              <Typography variant="overline" sx={{ color: 'primary.lighter', letterSpacing: 2 }}>
                GROW WITH CONFIDENCE
              </Typography>
              <Typography variant="h2" mt={1}>
                Make your money work with a clearer view.
              </Typography>
              <Typography mt={2} sx={{ color: 'primary.lighter', lineHeight: 1.75 }}>
                Investment updates and opportunities, presented with the same simplicity as everyday
                banking.
              </Typography>
            </Box>
            <Box
              sx={{ alignSelf: { md: 'center' }, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <IconifyIcon icon="solar:graph-up-bold" width={30} color="#8e64d4" />
              <Typography fontWeight={700}>Smart decisions start here</Typography>
            </Box>
          </Stack>
          <Grid container spacing={2.5} mt={2} position="relative">
            {investors.map((investment) => (
              <Grid item xs={12} md={4} key={investment.contentId}>
                <Card
                  sx={{
                    height: 1,
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,.08)',
                    color: 'common.white',
                    border: '1px solid rgba(255,255,255,.12)',
                    boxShadow: 'none',
                  }}
                >
                  <IconifyIcon icon="solar:chart-2-bold" width={25} color="#a98df6" />
                  <Typography variant="h5" mt={2}>
                    {investment.title}
                  </Typography>
                  <Typography mt={1} sx={{ color: 'primary.lighter', lineHeight: 1.65 }}>
                    {investment.contentBody}
                  </Typography>
                </Card>
              </Grid>
            ))}
            {home && !investors.length && (
              <Grid item xs={12}>
                <Typography sx={{ color: 'primary.lighter' }}>
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
