import { Box, Button, Container, Stack, Typography } from '@mui/material';
import {
  getAboutUs,
  getContactUs,
  getInvestors,
  getPublicHome,
  type PublicContent,
  type PublicHome,
} from 'api/banking';
import roboticCardHero from 'assets/prestige-robotic-card-green.png';
import IconifyIcon from 'components/base/IconifyIcon';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Logo from 'components/common/Logo';
import PublicHeader from 'components/common/PublicHeader';
import { Link as RouterLink } from 'react-router-dom';

const rule = { borderColor: 'rgba(205, 227, 216, .17)', borderStyle: 'solid' };

const Reveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      {
        threshold: 0.16,
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,32px,0)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
        '& .reveal-pop': {
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translate3d(0,0,0) scale(1)'
            : 'translate3d(14px,14px,0) scale(.94)',
          transition: `opacity 480ms cubic-bezier(.2,.8,.2,1) ${delay + 340}ms, transform 480ms cubic-bezier(.2,.8,.2,1) ${delay + 340}ms`,
        },
        '@media (prefers-reduced-motion: reduce)': {
          opacity: 1,
          transform: 'none',
          transition: 'none',
        },
      }}
    >
      {children}
    </Box>
  );
};

const initialsFor = (title: string) =>
  title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const TestimonialStage = ({ investors }: { investors: PublicContent[] }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (investors.length < 2) return undefined;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % investors.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [investors.length]);
  useEffect(() => setActive(0), [investors]);
  if (!investors.length) return null;
  const item = investors[active] || investors[0];
  return (
    <Box
      sx={{
        mt: 7,
        overflow: 'hidden',
        border: '1px solid rgba(155,230,201,.2)',
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,.035)',
        boxShadow: '0 28px 70px rgba(0,0,0,.2)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr .9fr' },
          minHeight: { md: 390 },
        }}
      >
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            pr: { md: 7 },
            borderRight: { md: '1px solid rgba(255,255,255,.17)' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            key={`quote-${active}`}
            sx={{
              animation: 'testimonialIn 620ms cubic-bezier(.2,.8,.2,1) both',
              '@keyframes testimonialIn': {
                from: { opacity: 0, transform: 'translate3d(0,24px,0)' },
                to: { opacity: 1, transform: 'none' },
              },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            <Typography sx={{ color: '#9BE6C9', font: '12px DM Mono' }}>“</Typography>
            <Typography
              sx={{
                fontFamily: 'Fraunces',
                fontSize: { xs: 30, md: 43 },
                letterSpacing: '-.055em',
                lineHeight: 1.15,
                mt: 1.5,
              }}
            >
              {item.contentBody}
            </Typography>
          </Box>
          <Stack
            direction="row"
            gap={1.5}
            alignItems="center"
            mt={4}
            key={`person-${active}`}
            sx={{
              animation: 'testimonialIn 620ms cubic-bezier(.2,.8,.2,1) 100ms both',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: '#9BE6C9',
                color: '#10251D',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {initialsFor(item.title)}
            </Box>
            <Box>
              <Typography fontWeight={700}>{item.title}</Typography>
              <Typography variant="caption" sx={{ color: '#8FA299' }}>
                {item.contactEmail || item.contactPhone || item.contentKey}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack sx={{ py: { xs: 4, md: 6 }, pl: { md: 7 } }} justifyContent="space-between" gap={5}>
          <Typography
            key={`reflection-${active}`}
            sx={{
              fontFamily: 'Fraunces',
              fontSize: { xs: 26, md: 33 },
              letterSpacing: '-.05em',
              lineHeight: 1.15,
              animation: 'testimonialIn 620ms cubic-bezier(.2,.8,.2,1) 80ms both',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {item.title}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="end">
            <Stack direction="row" gap={1}>
              {investors.map((investor, index) => (
                <Box
                  key={investor.contentId}
                  component="button"
                  aria-label={`Show investor update: ${investor.title}`}
                  onClick={() => setActive(index)}
                  sx={{
                    border: 0,
                    cursor: 'pointer',
                    p: 0,
                    width: index === active ? 42 : 16,
                    height: 2,
                    bgcolor: index === active ? '#9BE6C9' : 'rgba(155,230,201,.28)',
                    transition: 'width 360ms ease, background-color 360ms ease',
                  }}
                />
              ))}
            </Stack>
            <Typography sx={{ color: '#9BE6C9', font: '10px DM Mono', letterSpacing: '.1em' }}>
              0{active + 1} / 0{investors.length}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const InvestorCards = ({ investors }: { investors: PublicContent[] }) => (
  <Box
    sx={{
      mt: 7,
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, minmax(0, 1fr))',
        xl: 'repeat(3, minmax(0, 1fr))',
      },
      gap: 2.5,
    }}
  >
    {investors.map((item, index) => (
      <Box
        component="article"
        key={item.contentId}
        sx={{
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 3, md: 3.5 },
          border: '1px solid rgba(155,230,201,.2)',
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,.035)',
          boxShadow: '0 18px 45px rgba(0,0,0,.16)',
          transition: 'transform .25s ease, border-color .25s ease, background-color .25s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: 'rgba(155,230,201,.48)',
            bgcolor: 'rgba(255,255,255,.055)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              width: 42,
              height: 42,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: '#9BE6C9',
              color: '#10251D',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {initialsFor(item.title)}
          </Box>
          <Typography sx={{ color: '#9BE6C9', font: '10px DM Mono', letterSpacing: '.1em' }}>
            UPDATE / {String(index + 1).padStart(2, '0')}
          </Typography>
        </Stack>
        <Typography
          component="h3"
          sx={{
            mt: 4,
            fontFamily: 'Fraunces',
            fontSize: { xs: 28, md: 34 },
            letterSpacing: '-.045em',
            lineHeight: 1.08,
          }}
        >
          {item.title}
        </Typography>
        <Typography sx={{ mt: 2, color: '#A9BBB2', lineHeight: 1.7 }}>
          {item.contentBody}
        </Typography>
        <Typography variant="caption" sx={{ mt: 'auto', pt: 4, color: '#9BE6C9' }}>
          {item.contactEmail || item.contactPhone || item.contentKey}
        </Typography>
      </Box>
    ))}
  </Box>
);

const HomePage = () => {
  const [home, setHome] = useState<PublicHome | null>(null);
  const [investors, setInvestors] = useState<PublicContent[]>([]);
  const [about, setAbout] = useState<PublicContent | null>(null);
  const [contact, setContact] = useState<PublicContent | null>(null);
  const [publicLoaded, setPublicLoaded] = useState(false);
  const welcomeMessage = home?.welcomeMessage
    .replace(/\s*Your trusted banking partner\.?/i, '')
    .trim();

  useEffect(() => {
    let active = true;
    void Promise.allSettled([getPublicHome(), getInvestors(), getAboutUs(), getContactUs()]).then(
      ([homeResult, investorResult, aboutResult, contactResult]) => {
        if (!active) return;
        if (homeResult.status === 'fulfilled') setHome(homeResult.value.data);
        if (investorResult.status === 'fulfilled') setInvestors(investorResult.value.data);
        if (aboutResult.status === 'fulfilled') setAbout(aboutResult.value.data);
        if (contactResult.status === 'fulfilled') setContact(contactResult.value.data);
        setPublicLoaded(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', bgcolor: '#0B1110', color: '#EEF5F1' }}>
      <Box
        sx={{
          '@keyframes drift': {
            '0%,100%': { transform: 'translate3d(0,0,0) rotate(-8deg)' },
            '50%': { transform: 'translate3d(0,-16px,0) rotate(-6deg)' },
          },
          '@keyframes receipt': {
            '0%,100%': { transform: 'translate3d(0,0,0) rotate(5deg)' },
            '50%': { transform: 'translate3d(12px,9px,0) rotate(4deg)' },
          },
          '@keyframes orbit': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          '@keyframes trace': { from: { strokeDashoffset: 620 }, to: { strokeDashoffset: 0 } },
          '@keyframes heroEnter': {
            from: { opacity: 0, transform: 'translate3d(0,28px,0)' },
            to: { opacity: 1, transform: 'none' },
          },
          '@keyframes artifactEnter': {
            from: { opacity: 0, transform: 'translate3d(40px,28px,0) scale(.88)' },
            to: { opacity: 1, transform: 'none' },
          },
          '@keyframes cardSheen': {
            '0%,25%': { transform: 'translateX(-145%) skewX(-19deg)' },
            '55%,100%': { transform: 'translateX(260%) skewX(-19deg)' },
          },
          '@keyframes statusPulse': {
            '0%,100%': { boxShadow: '0 0 0 0 rgba(155,230,201,.45)' },
            '50%': { boxShadow: '0 0 0 10px rgba(155,230,201,0)' },
          },
          '@media (prefers-reduced-motion: reduce)': { '& *': { animation: 'none !important' } },
        }}
      >
        <PublicHeader />
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            minHeight: { md: 650 },
            overflow: 'hidden',
            pt: { xs: 8, md: 13 },
            pb: { xs: 9, md: 4 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 620,
              height: 620,
              borderRadius: '50%',
              bgcolor: '#1A5B45',
              opacity: 0.22,
              filter: 'blur(130px)',
              top: 70,
              right: -130,
              pointerEvents: 'none',
              animation: 'artifactEnter 900ms cubic-bezier(.2,.8,.2,1) 200ms both',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 28, md: 12 },
              right: { xs: -120, md: -40 },
              bottom: { md: 20 },
              width: { xs: 440, md: '59%' },
              height: { xs: 440, md: 'auto' },
              opacity: { xs: 0.32, md: 1 },
              pointerEvents: 'none',
              '& > :not(.hero-artwork)': { display: 'none' },
            }}
          >
            <Box
              className="hero-artwork"
              component="img"
              src={roboticCardHero}
              alt="Robotic precision arms securely holding a bank card"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'drop-shadow(0 32px 48px rgba(0,0,0,.42))',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,.85) 16%, #000 28%, #000 100%)',
                maskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,.85) 16%, #000 28%, #000 100%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: 35, md: 35 },
                border: '1px solid rgba(155,230,201,.23)',
                borderRadius: '50%',
                animation: 'orbit 24s linear infinite',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  bgcolor: '#A4ECCB',
                  top: '11%',
                  left: '12%',
                  boxShadow: '0 0 20px #A4ECCB',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#A4ECCB',
                  bottom: '15%',
                  right: '4%',
                }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: 77, md: 96 },
                border: '1px dashed rgba(155,230,201,.14)',
                borderRadius: '50%',
                animation: 'orbit 34s linear infinite reverse',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 53, md: 105 },
                top: { xs: 117, md: 152 },
                width: { xs: 255, md: 370 },
                height: { xs: 150, md: 216 },
                p: { xs: 2, md: 2.75 },
                color: '#F0F7F3',
                background: 'linear-gradient(135deg, #2D493F, #14241F 65%)',
                border: '1px solid rgba(183,226,204,.35)',
                boxShadow: '20px 31px 55px rgba(0,0,0,.35)',
                transform: 'rotate(-8deg)',
                animation: 'drift 6s ease-in-out infinite',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: '-35% auto -35% -20%',
                  width: '28%',
                  bgcolor: 'rgba(205,255,230,.16)',
                  animation: 'cardSheen 7s ease-in-out infinite',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ font: '10px DM Mono', letterSpacing: '.14em', color: '#BAE5D1' }}>
                  {home?.bankName || (publicLoaded ? 'BANKING' : 'Loading…')}
                </Typography>
                <IconifyIcon icon="solar:chip-bold" width={25} color="#B5D9C7" />
              </Stack>
              <Typography
                sx={{
                  mt: { xs: 2.5, md: 4 },
                  fontFamily: 'Space Grotesk',
                  fontSize: { xs: 23, md: 32 },
                  letterSpacing: '.11em',
                }}
              >
                •••• ••••
              </Typography>
              <Stack direction="row" justifyContent="space-between" mt={{ xs: 2, md: 3 }}>
                <Typography sx={{ font: '9px DM Mono', color: '#9EB6AA' }}>
                  SECURE ACCESS
                </Typography>
                <Typography sx={{ fontFamily: 'Fraunces', fontSize: 17 }}>PRESTIGE</Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 198, md: 342 },
                top: { xs: 245, md: 330 },
                width: { xs: 175, md: 232 },
                p: 1.75,
                bgcolor: '#E9F0EC',
                color: '#14221D',
                border: '1px solid #FFF',
                boxShadow: '12px 20px 35px rgba(0,0,0,.25)',
                transform: 'rotate(5deg)',
                animation: 'receipt 7.5s ease-in-out infinite',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ font: '9px DM Mono', letterSpacing: '.12em' }}>
                  TRANSFER
                </Typography>
                <IconifyIcon icon="solar:verified-check-bold" color="#178A68" width={17} />
              </Stack>
              <Typography
                sx={{
                  fontFamily: 'Space Grotesk',
                  fontSize: { xs: 18, md: 23 },
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {home?.offers[0]?.title || (publicLoaded ? 'No active offer' : 'Loading…')}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: 66, md: 95 },
                left: { xs: 242, md: 450 },
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.8,
                p: 1.1,
                bgcolor: 'rgba(18,35,29,.9)',
                border: '1px solid rgba(155,230,201,.32)',
                boxShadow: '0 12px 26px rgba(0,0,0,.2)',
                animation: 'receipt 5.6s ease-in-out 1s infinite',
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#9BE6C9',
                  animation: 'statusPulse 2.4s ease-out infinite',
                }}
              />
              <Typography sx={{ font: '9px DM Mono', letterSpacing: '.09em', color: '#C9F1DE' }}>
                PROTECTED LIVE
              </Typography>
            </Box>
            <Box
              component="svg"
              viewBox="0 0 580 130"
              sx={{
                position: 'absolute',
                bottom: { xs: 30, md: 25 },
                left: 0,
                width: 1,
                height: 135,
                overflow: 'visible',
              }}
            >
              <path
                d="M0 110C62 96 91 112 143 76S234 93 290 53S397 84 448 36S535 62 580 10"
                fill="none"
                stroke="rgba(155,230,201,.6)"
                strokeWidth="1.8"
                strokeDasharray="620"
                style={{ animation: 'trace 2.6s ease-out both' }}
              />
            </Box>
          </Box>
          <Box sx={{ position: 'relative', maxWidth: 740 }}>
            <Typography
              sx={{
                color: '#9BE6C9',
                font: '11px DM Mono',
                letterSpacing: '.15em',
                animation: 'heroEnter 700ms cubic-bezier(.2,.8,.2,1) both',
              }}
            >
              {home?.bankName || (publicLoaded ? 'BANKING INFORMATION' : 'Loading…')}
            </Typography>
            <Typography
              component="h1"
              sx={{
                mt: 2,
                fontFamily: 'Fraunces, serif',
                fontWeight: 500,
                letterSpacing: '-.075em',
                fontSize: { xs: 52, sm: 70, md: 92 },
                lineHeight: 0.9,
                animation: 'heroEnter 850ms cubic-bezier(.2,.8,.2,1) 100ms both',
              }}
            >
              {welcomeMessage || (publicLoaded ? 'Welcome.' : 'Loading…')}
            </Typography>
            <Typography
              sx={{
                maxWidth: 465,
                color: '#9DAEA6',
                mt: 3,
                fontSize: { xs: 16, md: 19 },
                lineHeight: 1.65,
                animation: 'heroEnter 850ms cubic-bezier(.2,.8,.2,1) 210ms both',
              }}
            >
              {about?.contentBody ||
                (publicLoaded
                  ? 'Public banking information is currently unavailable.'
                  : 'Public banking information is loading.')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              gap={1.5}
              mt={4}
              sx={{ animation: 'heroEnter 850ms cubic-bezier(.2,.8,.2,1) 320ms both' }}
            >
              <Button
                component={RouterLink}
                to="/authentication/login"
                size="large"
                variant="contained"
                endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
                sx={{ bgcolor: '#9BE6C9', color: '#10251D', '&:hover': { bgcolor: '#C2F1DC' } }}
              >
                Access your account
              </Button>
              <Button
                href="#security"
                size="large"
                variant="text"
                sx={{ color: '#C6D8CF', justifyContent: 'flex-start' }}
              >
                Explore the experience{' '}
                <IconifyIcon icon="solar:arrow-down-linear" width={18} style={{ marginLeft: 9 }} />
              </Button>
            </Stack>
          </Box>
        </Container>
        <Box id="security" sx={{ borderTop: 1, borderBottom: 1, ...rule, bgcolor: '#101A16' }}>
          <Container maxWidth="xl">
            <Reveal>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                divider={
                  <Box
                    sx={{
                      borderColor: 'rgba(205,227,216,.14)',
                      borderRight: { md: 1 },
                      borderBottom: { xs: 1, md: 0 },
                    }}
                  />
                }
              >
                <Box sx={{ py: 4, pr: { md: 6 }, flex: 1 }}>
                  <Typography
                    sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: '#9BE6C9' }}
                  >
                    SECURITY STAYS IN THE PICTURE
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 27, md: 35 },
                      letterSpacing: '-.05em',
                      mt: 1,
                    }}
                  >
                    Protected by design.
                  </Typography>
                </Box>
                {[
                  [
                    'solar:shield-check-bold',
                    'Intent before action',
                    'Reviewable transfer details, before money moves.',
                  ],
                  [
                    'solar:eye-closed-bold',
                    'Privacy as standard',
                    'Your activity is yours—quietly guarded at every touchpoint.',
                  ],
                ].map(([i, t, d]) => (
                  <Stack key={t} direction="row" gap={1.5} sx={{ py: 4, px: { md: 5 }, flex: 1 }}>
                    <IconifyIcon icon={i} width={22} color="#9BE6C9" />
                    <Box>
                      <Typography fontWeight={700}>{t}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#91A39A', mt: 0.5, lineHeight: 1.55 }}
                      >
                        {d}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Reveal>
          </Container>
        </Box>
        <Box
          sx={{ bgcolor: '#E9F0EC', color: '#14231C', py: { xs: 8, md: 13 }, overflow: 'hidden' }}
        >
          <Container maxWidth="xl">
            <Reveal>
              <Box
                sx={{
                  p: { xs: 3, md: 5 },
                  border: '1px solid #CBD9D2',
                  borderRadius: 4,
                  bgcolor: '#F8FBF9',
                  boxShadow: '0 24px 60px rgba(20,58,45,.08)',
                }}
              >
                <Typography sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#178A68' }}>
                  ABOUT US / 02
                </Typography>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  justifyContent="space-between"
                  gap={6}
                  mt={2}
                >
                  <Typography
                    sx={{
                      maxWidth: 660,
                      fontFamily: 'Fraunces',
                      fontSize: 'clamp(20px, 4vw, 60px)',
                      lineHeight: 0.98,
                      letterSpacing: '-.065em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {publicLoaded ? 'About Prestige Banking System' : 'Loading…'}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: 420,
                      alignSelf: { lg: 'end' },
                      color: '#52665C',
                      lineHeight: 1.7,
                    }}
                  >
                    {about?.contentBody ||
                      (publicLoaded
                        ? 'Published information about Prestige Banking is currently unavailable.'
                        : 'Loading published content…')}
                  </Typography>
                </Stack>
              </Box>
            </Reveal>
            <Typography
              sx={{
                mt: { xs: 6, md: 8 },
                font: '11px DM Mono',
                letterSpacing: '.14em',
                color: '#178A68',
              }}
            >
              CURRENT OFFERS
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2.5,
              }}
            >
              {home?.offers.map((offer, index) => (
                <Reveal key={offer.contentId} delay={index * 110}>
                  <Stack
                    sx={{
                      height: 1,
                      minHeight: 300,
                      p: { xs: 3, md: 3.5 },
                      border: '1px solid #CBD9D2',
                      borderRadius: 3,
                      bgcolor: '#F8FBF9',
                      boxShadow: '0 18px 45px rgba(20,58,45,.08)',
                      transition: 'transform .25s ease, box-shadow .25s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 26px 55px rgba(20,58,45,.14)',
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ font: '11px DM Mono', color: '#178A68' }}>
                        OFFER / {String(index + 1).padStart(2, '0')}
                      </Typography>
                      <IconifyIcon
                        icon={index % 2 ? 'solar:wallet-money-bold' : 'solar:tag-price-bold'}
                        width={28}
                        color="#178A68"
                      />
                    </Stack>
                    <Typography
                      sx={{
                        fontFamily: 'Fraunces',
                        fontSize: { xs: 29, md: 36 },
                        lineHeight: 1.08,
                        letterSpacing: '-.05em',
                        mt: 4,
                      }}
                    >
                      {offer.title}
                    </Typography>
                    <Typography sx={{ mt: 2, mb: 4, color: '#52665C', lineHeight: 1.65 }}>
                      {offer.contentBody}
                    </Typography>
                    <Box
                      className="reveal-pop"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        mt: 'auto',
                        color: '#178A68',
                        font: '9px DM Mono',
                        letterSpacing: '.06em',
                      }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: '#178A68',
                          boxShadow: '0 0 0 5px #178A6815',
                        }}
                      />
                      {offer.contentKey}
                    </Box>
                  </Stack>
                </Reveal>
              ))}
              {home && !home.offers.length && (
                <Typography sx={{ py: 4, color: '#52665C' }}>
                  No active offers are currently published.
                </Typography>
              )}
            </Box>
          </Container>
        </Box>
        <Box
          sx={{ bgcolor: '#14231D', color: '#EEF5F1', py: { xs: 8, md: 12 }, position: 'relative' }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              bgcolor: '#24694F',
              opacity: 0.23,
              filter: 'blur(110px)',
              right: '-12%',
              top: '-45%',
            }}
          />
          <Container maxWidth="xl" sx={{ position: 'relative' }}>
            <Reveal>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                gap={5}
                alignItems={{ md: 'end' }}
              >
                <Box>
                  <Typography
                    sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#9BE6C9' }}
                  >
                    INVESTOR RELATIONS
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 40, md: 57 },
                      letterSpacing: '-.06em',
                      lineHeight: 1,
                      mt: 1.5,
                    }}
                  >
                    Investor information and updates.
                  </Typography>
                </Box>
                <Typography sx={{ maxWidth: 320, color: '#9AADA3', lineHeight: 1.65 }}>
                  Published investor information is loaded directly from Prestige Banking.
                </Typography>
              </Stack>
              {investors.length === 1 ? (
                <TestimonialStage investors={investors} />
              ) : (
                <InvestorCards investors={investors} />
              )}
              {!investors.length && (
                <Typography sx={{ mt: 5, color: '#9AADA3' }}>
                  No investor updates are currently published.
                </Typography>
              )}
            </Reveal>
          </Container>
        </Box>
        <Box id="contact" sx={{ bgcolor: '#0B1110', color: '#EFF5F1', py: { xs: 9, md: 13 } }}>
          <Container maxWidth="xl">
            <Reveal>
              <Stack alignItems="center" textAlign="center">
                <Typography sx={{ color: '#9BE6C9', font: '11px DM Mono', letterSpacing: '.14em' }}>
                  CONTACT PRESTIGE
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 800,
                    fontFamily: 'Fraunces',
                    fontSize: { xs: 46, md: 74 },
                    lineHeight: 0.95,
                    letterSpacing: '-.07em',
                    mt: 2,
                  }}
                >
                  {contact?.title ||
                    (publicLoaded
                      ? 'Contact information is currently unavailable.'
                      : 'Contact information is loading.')}
                </Typography>
                {contact?.contentBody && (
                  <Typography sx={{ mt: 2, maxWidth: 620, color: '#9AADA3', lineHeight: 1.7 }}>
                    {contact.contentBody}
                  </Typography>
                )}
                {(contact?.contactEmail || contact?.contactPhone) && (
                  <Typography sx={{ mt: 1.5, color: '#9BE6C9' }}>
                    {[contact.contactEmail, contact.contactPhone].filter(Boolean).join(' · ')}
                  </Typography>
                )}
                <Button
                  component={RouterLink}
                  to="/authentication/login"
                  size="large"
                  variant="contained"
                  endIcon={<IconifyIcon icon="solar:arrow-right-up-linear" />}
                  sx={{
                    mt: 4,
                    bgcolor: '#9BE6C9',
                    color: '#10251D',
                    '&:hover': { bgcolor: '#C2F1DC' },
                  }}
                >
                  Access your account
                </Button>
              </Stack>
            </Reveal>
            <Stack
              component="footer"
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              gap={2}
              sx={{
                mt: { xs: 9, md: 13 },
                pt: 3,
                borderTop: '1px solid rgba(255,255,255,.12)',
                color: '#81938A',
              }}
            >
              <Stack direction="row" color="common.white">
                <Logo light />
              </Stack>
              <Stack direction="row" gap={2}>
                <Typography variant="caption">Privacy</Typography>
                <Typography variant="caption">Security</Typography>
                <Typography variant="caption">Support</Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
export default HomePage;
