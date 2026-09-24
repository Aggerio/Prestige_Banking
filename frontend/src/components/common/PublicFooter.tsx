import { Box, Container, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import { Link as RouterLink } from 'react-router-dom';

const exploreLinks = [
  { label: 'About Prestige', to: '/about-us' },
  { label: 'Current offers', to: '/offers' },
  { label: 'Investor relations', to: '/investors' },
  { label: 'Contact us', to: '/contact-us' },
];

const FooterLink = ({ label, to }: { label: string; to: string }) => (
  <Typography
    component={RouterLink}
    to={to}
    sx={{
      color: '#D7F0E2',
      textDecoration: 'none',
      fontSize: 14,
      '&:hover': { color: '#fff', textDecoration: 'underline' },
    }}
  >
    {label}
  </Typography>
);

const PublicFooter = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: '#0B4934',
      color: '#F5FFFA',
      mt: 'auto',
      borderTop: '1px solid rgba(205, 246, 223, .22)',
      backgroundImage: 'radial-gradient(circle at 88% 10%, rgba(92,190,137,.22), transparent 30%)',
    }}
  >
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 6 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1.1fr 1fr', lg: '1.2fr .72fr .9fr .95fr' },
          gap: { xs: 4, md: 5 },
        }}
      >
        <Box>
          <Stack direction="row" alignItems="center" color="common.white">
            <Logo light />
          </Stack>
          <Typography
            sx={{ mt: 2, maxWidth: 290, color: '#C9E8D9', fontSize: 14, lineHeight: 1.65 }}
          >
            Banking that keeps everyday money matters simple, secure and within reach.
          </Typography>
          <Stack direction="row" gap={1.25} mt={2.5}>
            {[
              ['solar:shield-check-bold', 'Secure banking'],
              ['solar:lock-keyhole-bold', 'Protected access'],
            ].map(([icon, label]) => (
              <Stack key={label} direction="row" alignItems="center" gap={0.6}>
                <IconifyIcon icon={icon} width={15} color="#A8E5C4" />
                <Typography variant="caption" color="#C9E8D9">
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack gap={1.25}>
          <Typography sx={{ color: '#9BE2BD', font: '10px DM Mono', letterSpacing: '.14em' }}>
            EXPLORE
          </Typography>
          {exploreLinks.map((link) => (
            <FooterLink key={link.to} {...link} />
          ))}
        </Stack>

        <Stack gap={1.25}>
          <Typography sx={{ color: '#9BE2BD', font: '10px DM Mono', letterSpacing: '.14em' }}>
            SUPPORT
          </Typography>
          <Typography sx={{ color: '#D7F0E2', fontSize: 14 }}>Mumbai Head Office</Typography>
          <Typography sx={{ color: '#B9DBCA', fontSize: 14, lineHeight: 1.55 }}>
            12 Linking Road, Bandra West, Mumbai 400050
          </Typography>
          <Typography
            component="a"
            href="mailto:support@prestigebanking.example"
            sx={{ color: '#D7F0E2', fontSize: 14 }}
          >
            support@prestigebanking.example
          </Typography>
        </Stack>

        <Stack gap={1.25}>
          <Typography sx={{ color: '#9BE2BD', font: '10px DM Mono', letterSpacing: '.14em' }}>
            BANK SAFELY
          </Typography>
          <Typography sx={{ color: '#B9DBCA', fontSize: 14, lineHeight: 1.6 }}>
            We will never ask for your password, OTP, PIN or full account number by email or chat.
          </Typography>
          <Typography
            component={RouterLink}
            to="/contact-us"
            sx={{ color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
          >
            Get help securely →
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={1.5}
        sx={{ mt: 5, pt: 2.5, borderTop: '1px solid rgba(255,255,255,.18)', color: '#B9DBCA' }}
      >
        <Typography variant="caption">
          © {new Date().getFullYear()} Prestige Banking. All rights reserved.
        </Typography>
        <Stack direction="row" gap={2.5}>
          <Typography variant="caption">Privacy</Typography>
          <Typography variant="caption">Terms</Typography>
          <Typography variant="caption">Security</Typography>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default PublicFooter;
