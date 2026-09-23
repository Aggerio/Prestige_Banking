import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { getAboutUs, getContactUs, getInvestors, getOffers, type PublicContent } from 'api/banking';
import PublicHeader from 'components/common/PublicHeader';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export type PublicPageKind = 'about' | 'investors' | 'offers' | 'contact';

const pageCopy: Record<PublicPageKind, { eyebrow: string; title: string; description: string }> = {
  about: {
    eyebrow: 'ABOUT PRESTIGE',
    title: 'About Prestige Banking System',
    description: 'Learn more about Prestige Banking and the principles behind our service.',
  },
  investors: {
    eyebrow: 'INVESTOR RELATIONS',
    title: 'Information for our investors.',
    description: 'Read the latest published investor information and updates.',
  },
  offers: {
    eyebrow: 'CURRENT OFFERS',
    title: 'More value from your banking.',
    description: 'Explore the latest offers currently available from Prestige Banking.',
  },
  contact: {
    eyebrow: 'CONTACT US',
    title: 'We are here when you need us.',
    description: 'Find the latest published contact details for Prestige Banking.',
  },
};

const PublicInfoPage = ({ kind }: { kind: PublicPageKind }) => {
  const [content, setContent] = useState<PublicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const copy = pageCopy[kind];
  const usesCardLayout = kind !== 'contact';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);

    const request =
      kind === 'about'
        ? getAboutUs().then((response) => [response.data])
        : kind === 'contact'
          ? getContactUs().then((response) => [response.data])
          : kind === 'investors'
            ? getInvestors().then((response) => response.data)
            : getOffers().then((response) => response.data);

    void request
      .then((items) => {
        if (active) setContent(items);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [kind]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B1110', color: '#EEF5F1' }}>
      <PublicHeader />

      <Box sx={{ borderTop: '1px solid rgba(205,227,216,.12)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Typography sx={{ color: '#9BE6C9', font: '11px DM Mono', letterSpacing: '.15em' }}>
            {copy.eyebrow}
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 2,
              maxWidth: kind === 'about' || kind === 'offers' ? 'none' : 850,
              fontFamily: 'Fraunces, serif',
              fontSize:
                kind === 'about' || kind === 'offers'
                  ? 'clamp(19px, 5.2vw, 76px)'
                  : { xs: 48, sm: 64, md: 82 },
              fontWeight: 500,
              letterSpacing: '-.07em',
              lineHeight: 0.95,
              whiteSpace: kind === 'about' || kind === 'offers' ? 'nowrap' : 'normal',
            }}
          >
            {copy.title}
          </Typography>
          <Typography
            sx={{ mt: 3, maxWidth: 620, color: '#9DAEA6', fontSize: 18, lineHeight: 1.7 }}
          >
            {copy.description}
          </Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#E9F0EC', color: '#14231C', minHeight: 360 }}>
        <Container maxWidth="xl" sx={{ py: { xs: 7, md: 10 } }}>
          {loading && (
            <Typography sx={{ color: '#52665C' }}>Loading published information…</Typography>
          )}
          {failed && (
            <Typography sx={{ color: '#52665C' }}>
              This information is temporarily unavailable. Please try again later.
            </Typography>
          )}
          {!loading && !failed && !content.length && (
            <Typography sx={{ color: '#52665C' }}>
              No information is currently published.
            </Typography>
          )}

          <Stack
            gap={usesCardLayout ? 3 : 0}
            sx={{
              display: usesCardLayout ? 'grid' : 'flex',
              gridTemplateColumns:
                kind === 'offers'
                  ? { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }
                  : kind === 'investors'
                    ? { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }
                    : '1fr',
              borderTop: !usesCardLayout && content.length ? '1px solid #B9C8C0' : 0,
            }}
          >
            {content.map((item, index) => (
              <Box
                component="article"
                key={item.contentId}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: usesCardLayout
                    ? '1fr'
                    : { xs: '1fr', md: '90px minmax(220px, .8fr) 1.2fr' },
                  gap: usesCardLayout ? 2 : { xs: 1.5, md: 4 },
                  minHeight: usesCardLayout ? 260 : 'auto',
                  p: usesCardLayout ? { xs: 3, md: 4 } : 0,
                  py: usesCardLayout ? undefined : { xs: 4, md: 5 },
                  border: usesCardLayout ? '1px solid #CBD9D2' : 0,
                  borderBottom: usesCardLayout ? undefined : '1px solid #B9C8C0',
                  borderRadius: usesCardLayout ? 3 : 0,
                  bgcolor: usesCardLayout ? '#F8FBF9' : 'transparent',
                  boxShadow: usesCardLayout ? '0 18px 45px rgba(20,58,45,.08)' : 'none',
                  transition: usesCardLayout ? 'transform .25s ease, box-shadow .25s ease' : 'none',
                  '&:hover': usesCardLayout
                    ? { transform: 'translateY(-5px)', boxShadow: '0 26px 55px rgba(20,58,45,.14)' }
                    : undefined,
                }}
              >
                <Typography sx={{ color: '#178A68', font: '11px DM Mono' }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: 'Fraunces',
                    fontSize: kind === 'about' ? 'clamp(20px, 3.3vw, 38px)' : { xs: 30, md: 38 },
                    lineHeight: 1.05,
                    whiteSpace: kind === 'about' ? 'nowrap' : 'normal',
                  }}
                >
                  {item.title}
                </Typography>
                <Stack gap={2}>
                  <Typography sx={{ color: '#52665C', lineHeight: 1.75 }}>
                    {item.contentBody}
                  </Typography>
                  {(item.contactEmail || item.contactPhone) && (
                    <Typography sx={{ color: '#178A68', fontWeight: 600 }}>
                      {[item.contactEmail, item.contactPhone].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Button
            component={RouterLink}
            to="/authentication/login"
            variant="contained"
            size="large"
            sx={{ mt: 6, bgcolor: '#178A68', '&:hover': { bgcolor: '#126F55' } }}
          >
            Access your account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicInfoPage;
