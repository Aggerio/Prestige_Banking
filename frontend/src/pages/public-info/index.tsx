import { Box, Container, Stack, Typography } from '@mui/material';
import { getAboutUs, getContactUs, getInvestors, getOffers, type PublicContent } from 'api/banking';
import PublicHeader from 'components/common/PublicHeader';
import PublicFooter from 'components/common/PublicFooter';
import IconifyIcon from 'components/base/IconifyIcon';
import { useEffect, useState } from 'react';

export type PublicPageKind = 'about' | 'investors' | 'offers' | 'contact';

const pageCopy: Record<PublicPageKind, { eyebrow: string; title: string; description: string }> = {
  // Copy is route-specific, while the rendering and loading behaviour stay shared.
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
  const usesGlass = kind === 'offers';

  useEffect(() => {
    // The API returns either one entry or a list; normalize both shapes for this page.
    let active = true;
    setLoading(true);
    setFailed(false);

    // Select the endpoint that matches the public route currently being viewed.
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F5FAF7',
        color: '#123C2D',
      }}
    >
      <PublicHeader />

      <Box sx={{ bgcolor: '#E7F5EC', borderBottom: '1px solid #C8E2D4' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 6.5 } }}>
          <Typography sx={{ color: '#178A68', font: '11px DM Mono', letterSpacing: '.15em' }}>
            {copy.eyebrow}
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 2,
              maxWidth: 900,
              fontFamily: 'Fraunces, serif',
              fontSize: { xs: 44, sm: 60, md: 76 },
              fontWeight: 500,
              letterSpacing: '-.07em',
              lineHeight: 1,
              whiteSpace: 'normal',
              color: '#0A2F21',
            }}
          >
            {copy.title}
          </Typography>
          <Typography
            sx={{ mt: 2.5, maxWidth: 620, color: '#456B5A', fontSize: 18, lineHeight: 1.7 }}
          >
            {copy.description}
          </Typography>
        </Container>
      </Box>

      <Box sx={{ flex: 1, bgcolor: '#F8FCF9', color: '#14231C', minHeight: 260 }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
          {kind !== 'about' && loading && (
            <Typography sx={{ color: '#52665C' }}>Loading published information…</Typography>
          )}
          {kind !== 'about' && failed && (
            <Typography sx={{ color: '#52665C' }}>
              This information is temporarily unavailable. Please try again later.
            </Typography>
          )}
          {kind !== 'about' && !loading && !failed && !content.length && (
            <Typography sx={{ color: '#52665C' }}>
              No information is currently published.
            </Typography>
          )}

          {kind !== 'about' && (
            <Stack
              gap={usesCardLayout ? 3 : 0}
              sx={{
                display: usesCardLayout ? 'grid' : 'flex',
                gridTemplateColumns:
                  kind === 'offers'
                    ? {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(3, minmax(0, 1fr))',
                      }
                    : kind === 'investors'
                      ? { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }
                      : '1fr',
                borderTop: !usesCardLayout && content.length ? '1px solid #B9C8C0' : 0,
              }}
            >
              {content.map((item) => (
                <Box
                  component="article"
                  className={usesGlass ? 'glass-card' : undefined}
                  key={item.contentId}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: usesCardLayout
                      ? '1fr'
                      : { xs: '1fr', md: 'minmax(220px, .8fr) 1.2fr' },
                    gap: usesCardLayout ? 2 : { xs: 1.5, md: 4 },
                    minHeight: usesCardLayout ? 260 : 'auto',
                    p: usesCardLayout ? { xs: 3, md: 4 } : 0,
                    py: usesCardLayout ? undefined : { xs: 4, md: 5 },
                    border: usesCardLayout ? '1px solid #CBD9D2' : 0,
                    borderBottom: usesCardLayout ? undefined : '1px solid #B9C8C0',
                    borderRadius: usesCardLayout ? 3 : 0,
                    bgcolor: usesCardLayout
                      ? usesGlass
                        ? 'rgba(255,255,255,.72)'
                        : '#FFFFFF'
                      : 'transparent',
                    boxShadow: usesCardLayout ? '0 18px 45px rgba(20,58,45,.08)' : 'none',
                    backdropFilter: usesGlass ? 'blur(16px) saturate(140%)' : 'none',
                    transition: usesCardLayout
                      ? 'transform .25s ease, box-shadow .25s ease'
                      : 'none',
                    '&:hover': usesCardLayout
                      ? {
                          transform: 'translateY(-5px)',
                          bgcolor: usesGlass ? 'rgba(255,255,255,.92)' : '#FFFFFF',
                          boxShadow: '0 26px 55px rgba(20,58,45,.14)',
                        }
                      : undefined,
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 30, md: 38 },
                      lineHeight: 1.05,
                      whiteSpace: 'normal',
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
          )}

          {kind === 'about' && (
            <Stack gap={{ xs: 4, md: 5 }} mt={{ xs: 4, md: 5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: 3,
                }}
              >
                {[
                  [
                    'Our mission',
                    'To make everyday banking feel clear, dependable and human. We combine thoughtful digital experiences with practical support so customers can move money, plan ahead and make confident financial decisions.',
                  ],
                  [
                    'Our vision',
                    'A banking relationship that grows with every customer—from a first account to life’s biggest milestones—supported by secure technology, transparent communication and responsible innovation.',
                  ],
                ].map(([title, body], index) => (
                  <Box
                    key={title}
                    sx={{
                      p: { xs: 3, md: 3.5 },
                      borderRadius: 4,
                      border: '1px solid #C8E2D4',
                      bgcolor: index === 0 ? '#0F4D37' : '#E7F5EC',
                      color: index === 0 ? '#FFFFFF' : '#123C2D',
                    }}
                  >
                    <Typography
                      component="h2"
                      sx={{
                        fontFamily: 'Fraunces',
                        fontSize: { xs: 34, md: 45 },
                        lineHeight: 1,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography sx={{ mt: 1.5, maxWidth: 570, lineHeight: 1.7, opacity: 0.84 }}>
                      {body}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography sx={{ color: '#178A68', font: '11px DM Mono', letterSpacing: '.14em' }}>
                  WHAT GUIDES US
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    mt: 1.5,
                    fontFamily: 'Fraunces',
                    fontSize: { xs: 36, md: 48 },
                    letterSpacing: '-.05em',
                  }}
                >
                  Banking built around real life.
                </Typography>
                <Box
                  sx={{
                    mt: 2.5,
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      lg: 'repeat(4, minmax(0, 1fr))',
                    },
                    gap: 2,
                  }}
                >
                  {[
                    [
                      'solar:user-heart-bold-duotone',
                      'Customer first',
                      'We start with customer needs and remove unnecessary complexity from every interaction.',
                    ],
                    [
                      'solar:shield-check-bold-duotone',
                      'Secure by design',
                      'Protection, privacy and careful review are part of the experience from the beginning.',
                    ],
                    [
                      'solar:document-text-bold-duotone',
                      'Clear and transparent',
                      'Straightforward information helps customers understand their choices and stay in control.',
                    ],
                    [
                      'solar:chart-2-bold-duotone',
                      'Built for progress',
                      'Flexible services adapt as goals, families and businesses grow over time.',
                    ],
                  ].map(([icon, title, body], index) => (
                    <Box
                      key={title}
                      sx={{
                        p: 3,
                        minHeight: 230,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #C8DDD2',
                        borderRadius: 3,
                        bgcolor: '#FFFFFF',
                        boxShadow: '0 10px 28px rgba(20,58,45,.06)',
                        transition:
                          'transform .22s ease, border-color .22s ease, box-shadow .22s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#79B99A',
                          boxShadow: '0 16px 34px rgba(20,58,45,.11)',
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: 2.25,
                            bgcolor: '#E3F4EA',
                            color: '#137451',
                          }}
                        >
                          <IconifyIcon icon={icon} width={24} />
                        </Box>
                        <Typography sx={{ color: '#8EAA9D', font: '10px DM Mono' }}>
                          0{index + 1}
                        </Typography>
                      </Stack>
                      <Typography sx={{ mt: 3, fontWeight: 800, fontSize: 18 }}>{title}</Typography>
                      <Typography
                        sx={{ mt: 1.25, color: '#52665C', fontSize: 14, lineHeight: 1.7 }}
                      >
                        {body}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #CBD9D2',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '.8fr 1.2fr' },
                  gap: { xs: 3, md: 5 },
                }}
              >
                <Box>
                  <Typography
                    sx={{ color: '#178A68', font: '11px DM Mono', letterSpacing: '.14em' }}
                  >
                    OUR COMMITMENT
                  </Typography>
                  <Typography
                    component="h2"
                    sx={{
                      mt: 2,
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 36, md: 48 },
                      lineHeight: 1.05,
                    }}
                  >
                    Here for the moments that matter.
                  </Typography>
                </Box>
                <Stack gap={2}>
                  {[
                    [
                      'Everyday confidence',
                      'Simple account access, clear transaction information and tools that keep daily finances organised.',
                    ],
                    [
                      'Support with context',
                      'Helpful guidance that considers the customer’s situation and makes the next step easier to understand.',
                    ],
                    [
                      'Responsible growth',
                      'Long-term decisions that balance innovation with resilience, trust and care for the communities we serve.',
                    ],
                  ].map(([title, body]) => (
                    <Box
                      key={title}
                      sx={{
                        pb: 2,
                        borderBottom: '1px solid #DCE9E2',
                        '&:last-child': { pb: 0, borderBottom: 0 },
                      }}
                    >
                      <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
                      <Typography sx={{ mt: 0.75, color: '#52665C', lineHeight: 1.7 }}>
                        {body}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Container>
      </Box>
      <PublicFooter />
    </Box>
  );
};

export default PublicInfoPage;
