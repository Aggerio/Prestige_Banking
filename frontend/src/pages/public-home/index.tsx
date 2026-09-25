import { Box, Button, Container, Stack, Typography } from '@mui/material';
import {
  getAboutUs,
  getAdvertisements,
  getContactUs,
  getInvestors,
  getPublicHome,
  type PublicContent,
  type PublicHome,
} from 'api/banking';
import bronzeGrabber from 'assets/prestige-bronze-grabber-v2.png';
import IconifyIcon from 'components/base/IconifyIcon';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import PublicHeader from 'components/common/PublicHeader';
import PublicFooter from 'components/common/PublicFooter';
import { Link as RouterLink } from 'react-router-dom';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const promotionImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
];

const promotionImageFor = (contentKey: string, fallbackIndex: number) => {
  if (contentKey.includes('HOME_FINANCE') || contentKey.includes('HOME_LOAN')) {
    return promotionImages[0];
  }
  if (contentKey.includes('DEBIT_CARD') || contentKey.includes('CARD')) {
    return promotionImages[1];
  }
  if (contentKey.includes('DIGITAL')) {
    return promotionImages[2];
  }
  if (contentKey.includes('SAVINGS') || contentKey.includes('DEPOSIT')) {
    return promotionImages[3];
  }

  return promotionImages[fallbackIndex % promotionImages.length];
};

const shuffle = <T,>(items: T[]) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

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

const RoboticCardAssembly = ({ bankName, className }: { bankName: string; className?: string }) => (
  <Box
    className={className}
    aria-label="Robotic grabbers presenting a Prestige bank card"
    role="img"
    sx={{
      position: 'relative',
      width: 1,
      height: 1,
      isolation: 'isolate',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '72%',
        aspectRatio: '1',
        left: '14%',
        top: '7%',
        borderRadius: '50%',
        border: '1px solid rgba(23,138,104,.18)',
        boxShadow: '0 0 0 42px rgba(98,185,141,.06), 0 0 80px rgba(98,185,141,.16)',
      },
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        bottom: '15%',
        width: { xs: 250, md: 370 },
        height: { xs: 150, md: 218 },
        p: { xs: 2, md: 2.75 },
        zIndex: 3,
        overflow: 'hidden',
        color: '#F0F7F3',
        borderRadius: { xs: 2.5, md: 3.5 },
        border: '1px solid rgba(183,226,204,.7)',
        background:
          'radial-gradient(circle at 82% 18%, rgba(132,217,174,.22), transparent 26%), linear-gradient(135deg, #287456, #0D3B2A 72%)',
        boxShadow: '0 32px 70px rgba(20,92,61,.32)',
        transform: 'translate(-50%, 0)',
        animation: 'cardRise 1600ms cubic-bezier(.22,1,.36,1) 120ms both',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '-45% auto -45% -35%',
          width: '24%',
          bgcolor: 'rgba(222,255,238,.17)',
          transform: 'skewX(-18deg)',
          animation: 'oneShotSheen 700ms ease-out 1750ms both',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ font: '600 10px DM Mono', letterSpacing: '.13em', color: '#C7EFDA' }}>
          {bankName}
        </Typography>
        <IconifyIcon icon="solar:chip-bold" width={28} color="#B5D9C7" />
      </Stack>
      <Typography
        sx={{
          mt: { xs: 2.8, md: 4.3 },
          fontFamily: 'Space Grotesk',
          fontSize: { xs: 22, md: 31 },
          letterSpacing: '.12em',
        }}
      >
        •••• ••••
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="end" mt={{ xs: 2, md: 3 }}>
        <Box>
          <Typography sx={{ font: '8px DM Mono', color: '#8FB7A5' }}>CARD HOLDER</Typography>
          <Typography sx={{ mt: 0.4, fontSize: 12, letterSpacing: '.08em' }}>
            PRESTIGE MEMBER
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: 'Fraunces', fontSize: { xs: 16, md: 19 } }}>
          PRESTIGE
        </Typography>
      </Stack>
    </Box>

    {(['left', 'right'] as const).map((side) => (
      <Box
        key={side}
        component="img"
        src={bronzeGrabber}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          zIndex: 4,
          top: { xs: '-4%', md: '-13%' },
          left: '50%',
          width: { xs: '78%', md: '60%' },
          height: 'auto',
          transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 24px 30px rgba(68,34,12,.24))',
          clipPath: side === 'left' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)',
          transformOrigin: side === 'left' ? '50% 24%' : '50% 24%',
          animation: `${side === 'left' ? 'leftGrabber' : 'rightGrabber'} 1600ms cubic-bezier(.22,1,.36,1) 120ms both`,
        }}
      />
    ))}

    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        position: 'absolute',
        left: '50%',
        bottom: '6%',
        transform: 'translateX(-50%)',
        color: '#126F55',
        animation: 'assemblyStatus 420ms ease-out 1750ms both',
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#178A68' }} />
      <Typography sx={{ font: '600 9px DM Mono', letterSpacing: '.15em' }}>
        SECURELY PRESENTED
      </Typography>
    </Stack>
  </Box>
);

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
        position: 'relative',
        border: '1px solid rgba(255,255,255,.62)',
        borderRadius: 4,
        bgcolor: '#F8FCF9',
        boxShadow: '0 16px 36px rgba(20,92,61,.1)',
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
            borderRight: { md: '1px solid #C9E5D6' },
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
            <Typography sx={{ color: '#178A68', font: '12px DM Mono' }}>“</Typography>
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
                width: 54,
                height: 54,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: '#DDF4E7',
                color: '#126F55',
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {initialsFor(item.title)}
            </Box>
            <Box>
              <Typography fontWeight={700}>{item.title}</Typography>
              <Typography variant="caption" sx={{ color: '#527363' }}>
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
                    bgcolor: index === active ? '#178A68' : '#B8DCC9',
                    transition: 'width 360ms ease, background-color 360ms ease',
                  }}
                />
              ))}
            </Stack>
            <Typography sx={{ color: '#178A68', font: '10px DM Mono', letterSpacing: '.1em' }}>
              PARTNERSHIP SPOTLIGHT
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
    {investors.map((item) => (
      <Box
        component="article"
        key={item.contentId}
        sx={{
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 3, md: 3.5 },
          position: 'relative',
          border: '1px solid #C9E5D6',
          borderRadius: 3,
          bgcolor: '#F8FCF9',
          boxShadow: '0 16px 36px rgba(20,92,61,.09)',
          transition: 'transform .25s ease, border-color .25s ease, background-color .25s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: '#7DBE9D',
            bgcolor: 'rgba(255,255,255,.9)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              width: 70,
              height: 70,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: '#DDF4E7',
              color: '#126F55',
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            {initialsFor(item.title)}
          </Box>
          <Typography sx={{ color: '#178A68', font: '10px DM Mono', letterSpacing: '.1em' }}>
            PARTNERSHIP SPOTLIGHT
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
        <Typography sx={{ mt: 2, color: '#527363', lineHeight: 1.7 }}>
          {item.contentBody}
        </Typography>
        <Typography variant="caption" sx={{ mt: 'auto', pt: 4, color: '#178A68' }}>
          {item.contactEmail || item.contactPhone || item.contentKey}
        </Typography>
      </Box>
    ))}
  </Box>
);

const HomePage = () => {
  const [home, setHome] = useState<PublicHome | null>(null);
  const [advertisements, setAdvertisements] = useState<PublicContent[]>([]);
  const [investors, setInvestors] = useState<PublicContent[]>([]);
  const [about, setAbout] = useState<PublicContent | null>(null);
  const [contact, setContact] = useState<PublicContent | null>(null);
  const [publicLoaded, setPublicLoaded] = useState(false);
  const welcomeMessage = home?.welcomeMessage
    .replace(/\s*Your trusted banking partner\.?/i, '')
    .trim();

  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      getPublicHome(),
      getAdvertisements(),
      getInvestors(),
      getAboutUs(),
      getContactUs(),
    ]).then(([homeResult, advertisementResult, investorResult, aboutResult, contactResult]) => {
      if (!active) return;
      if (homeResult.status === 'fulfilled') setHome(homeResult.value.data);
      if (advertisementResult.status === 'fulfilled')
        setAdvertisements(advertisementResult.value.data);
      if (investorResult.status === 'fulfilled') setInvestors(investorResult.value.data);
      if (aboutResult.status === 'fulfilled') setAbout(aboutResult.value.data);
      if (contactResult.status === 'fulfilled') setContact(contactResult.value.data);
      setPublicLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const promotions = useMemo(
    () => shuffle([...advertisements, ...(home?.offers ?? [])]),
    [advertisements, home?.offers],
  );

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'clip', bgcolor: '#F7FCF9', color: '#123C2D' }}>
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
          '@keyframes cardRise': {
            from: { transform: 'translate(-50%, 380px) scale(.96)' },
            to: { transform: 'translate(-50%, 0) scale(1)' },
          },
          '@keyframes leftGrabber': {
            from: { transform: 'translateX(calc(-50% - 100px))' },
            to: { transform: 'translateX(-50%)' },
          },
          '@keyframes rightGrabber': {
            from: { transform: 'translateX(calc(-50% + 100px))' },
            to: { transform: 'translateX(-50%)' },
          },
          '@keyframes assemblyStatus': {
            from: { opacity: 0, transform: 'translate(-50%, 8px)' },
            to: { opacity: 1, transform: 'translate(-50%, 0)' },
          },
          '@keyframes oneShotSheen': {
            from: { transform: 'translateX(0) skewX(-18deg)' },
            to: { transform: 'translateX(650%) skewX(-18deg)' },
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
              bgcolor: '#62B98D',
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
            <RoboticCardAssembly
              className="hero-artwork"
              bankName={home?.bankName || (publicLoaded ? 'PRESTIGE BANKING' : 'PRESTIGE')}
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
                background: 'linear-gradient(135deg, #287456, #124631 65%)',
                border: '1px solid rgba(183,226,204,.55)',
                boxShadow: '20px 31px 55px rgba(20,92,61,.25)',
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
                bgcolor: 'rgba(255,255,255,.94)',
                color: '#123C2D',
                border: '1px solid rgba(23,138,104,.25)',
                boxShadow: '0 12px 26px rgba(20,92,61,.15)',
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
                color: '#126F55',
                fontFamily: 'Manrope, sans-serif',
                fontSize: { xs: 15, md: 18 },
                fontWeight: 800,
                letterSpacing: '.08em',
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
                color: '#456B5A',
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
                sx={{ bgcolor: '#178A68', color: '#fff', '&:hover': { bgcolor: '#126F55' } }}
              >
                Access your account
              </Button>
              <Button
                href="#security"
                size="large"
                variant="text"
                sx={{ color: '#126F55', justifyContent: 'flex-start' }}
              >
                Explore the experience{' '}
                <IconifyIcon icon="solar:arrow-down-linear" width={18} style={{ marginLeft: 9 }} />
              </Button>
            </Stack>
          </Box>
        </Container>
        <Box
          id="security"
          sx={{ borderTop: 1, borderBottom: 1, borderColor: '#C9E5D6', bgcolor: '#EAF7F0' }}
        >
          <Container maxWidth="xl">
            <Reveal>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                divider={
                  <Box
                    sx={{
                      borderColor: '#C9E5D6',
                      borderRight: { md: 1 },
                      borderBottom: { xs: 1, md: 0 },
                    }}
                  />
                }
              >
                <Box sx={{ py: 4, pr: { md: 6 }, flex: 1 }}>
                  <Typography
                    sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: '#178A68' }}
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
                    <IconifyIcon icon={i} width={22} color="#178A68" />
                    <Box>
                      <Typography fontWeight={700}>{t}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#527363', mt: 0.5, lineHeight: 1.55 }}
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
          sx={{ bgcolor: '#E9F0EC', color: '#14231C', py: { xs: 6, md: 8 }, overflow: 'hidden' }}
        >
          <Container maxWidth="xl">
            <Reveal>
              <Box
                sx={{
                  p: { xs: 2.5, md: 3.5 },
                  border: '1px solid #CBD9D2',
                  borderRadius: 4,
                  bgcolor: '#F8FBF9',
                  boxShadow: '0 14px 32px rgba(20,92,61,.08)',
                }}
              >
                <Typography sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#178A68' }}>
                  ABOUT US
                </Typography>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  justifyContent="space-between"
                  gap={{ xs: 2.5, lg: 4 }}
                  mt={1.5}
                >
                  <Typography
                    sx={{
                      maxWidth: 660,
                      fontFamily: 'Fraunces',
                      fontSize: 'clamp(20px, 4vw, 60px)',
                      lineHeight: 0.98,
                      letterSpacing: '-.065em',
                      whiteSpace: 'nowrap',
                      color: '#0A2F21',
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
            {promotions.length > 0 && (
              <Reveal>
                <Box sx={{ mt: { xs: 6, md: 8 } }}>
                  <Typography
                    sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#178A68' }}
                  >
                    PRODUCTS AND PROMOTIONS
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.25,
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 30, md: 42 },
                      letterSpacing: '-.05em',
                    }}
                  >
                    What is new at Prestige.
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      pb: 4,
                      '& .swiper-slide': { height: 'auto' },
                      '& .swiper-pagination': { bottom: -2 },
                      '& .swiper-pagination-bullet-active': {
                        width: 24,
                        borderRadius: 4,
                        bgcolor: '#178A68',
                      },
                    }}
                  >
                    <Swiper
                      modules={[Autoplay, Pagination, A11y]}
                      pagination={{ clickable: true }}
                      loop={promotions.length > 1}
                      speed={700}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                      }}
                      slidesPerView={1}
                      a11y={{ enabled: true }}
                    >
                      {promotions.map((item, index) => (
                        <SwiperSlide key={`${item.contentType}-${item.contentId}`}>
                          <Box
                            component="article"
                            sx={{
                              maxWidth: 820,
                              minHeight: { xs: 330, sm: 250 },
                              mx: 'auto',
                              display: 'grid',
                              gridTemplateColumns: { xs: '1fr', sm: '250px minmax(0, 1fr)' },
                              overflow: 'hidden',
                              border: '1px solid #C9E5D6',
                              borderRadius: 3,
                              bgcolor: '#fff',
                              boxShadow: '0 16px 36px rgba(20,92,61,.1)',
                            }}
                          >
                            <Box
                              component="img"
                              src={item.imageUrl || promotionImageFor(item.contentKey, index)}
                              alt=""
                              sx={{
                                width: '100%',
                                height: { xs: 140, sm: '100%' },
                                minHeight: { sm: 250 },
                                display: 'block',
                                objectFit: 'cover',
                              }}
                            />
                            <Stack
                              sx={{ p: { xs: 2.5, sm: 3 }, minHeight: 190 }}
                              justifyContent="center"
                              gap={1}
                            >
                              <Typography
                                sx={{
                                  color: '#178A68',
                                  font: '10px DM Mono',
                                  letterSpacing: '.1em',
                                }}
                              >
                                {item.contentType === 'ADVERTISEMENT'
                                  ? 'ADVERTISEMENT'
                                  : 'FEATURED OFFER'}
                              </Typography>
                              <Typography
                                component="h2"
                                sx={{ fontFamily: 'Fraunces', fontSize: 25, lineHeight: 1.1 }}
                              >
                                {item.title}
                              </Typography>
                              <Typography sx={{ color: '#52665C', fontSize: 14, lineHeight: 1.55 }}>
                                {item.contentBody}
                              </Typography>
                            </Stack>
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                </Box>
              </Reveal>
            )}
            <Typography
              sx={{
                mt: { xs: 4, md: 5 },
                font: '11px DM Mono',
                letterSpacing: '.14em',
                color: '#178A68',
              }}
            >
              CURRENT OFFERS
            </Typography>
            {home?.offers.length ? (
              <Reveal>
                <Box
                  className="offer-swiper"
                  sx={{
                    mt: 3,
                    px: { xs: 0, md: 6 },
                    pb: 4,
                    '& .swiper': { overflow: 'visible' },
                    '& .swiper-wrapper': { transitionTimingFunction: 'linear !important' },
                    '& .swiper-slide': { height: 'auto' },
                    '& .swiper-pagination': { bottom: -2 },
                    '& .swiper-pagination-bullet': {
                      width: 7,
                      height: 7,
                      bgcolor: '#8BC5A6',
                      opacity: 1,
                    },
                    '& .swiper-pagination-bullet-active': {
                      width: 24,
                      borderRadius: 4,
                      bgcolor: '#178A68',
                    },
                  }}
                >
                  <Swiper
                    modules={[Autoplay, Pagination, A11y]}
                    pagination={{ clickable: true }}
                    loop={home.offers.length > 1}
                    speed={6500}
                    autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
                    spaceBetween={20}
                    slidesPerView={1.08}
                    breakpoints={{
                      600: { slidesPerView: 2, spaceBetween: 20 },
                      1200: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    a11y={{ enabled: true }}
                  >
                    {home.offers.map((offer, index) => (
                      <SwiperSlide key={offer.contentId}>
                        <Stack
                          className="glass-card"
                          sx={{
                            height: '100%',
                            minHeight: 248,
                            p: { xs: 2.5, md: 3 },
                            border: '1px solid rgba(255,255,255,.68)',
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,.42)',
                            boxShadow:
                              '0 16px 38px rgba(20,92,61,.1), inset 0 1px 0 rgba(255,255,255,.72), inset 0 0 22px 6px rgba(255,255,255,.16)',
                            backdropFilter: 'blur(20px) saturate(150%)',
                            transition: 'transform .25s ease, box-shadow .25s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 26px 55px rgba(20,58,45,.14)',
                            },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ font: '11px DM Mono', color: '#178A68' }}>
                              FEATURED OFFER
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
                              mt: 2.5,
                            }}
                          >
                            {offer.title}
                          </Typography>
                          <Typography sx={{ mt: 1.5, mb: 2, color: '#52665C', lineHeight: 1.6 }}>
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
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Reveal>
            ) : (
              publicLoaded && (
                <Typography sx={{ py: 4, color: '#52665C' }}>
                  No active offers are currently published.
                </Typography>
              )
            )}
          </Container>
        </Box>
        <Box
          sx={{ bgcolor: '#E1F3E9', color: '#123C2D', py: { xs: 8, md: 12 }, position: 'relative' }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              bgcolor: '#62B98D',
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
                    sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#178A68' }}
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
                <Typography sx={{ maxWidth: 320, color: '#456B5A', lineHeight: 1.65 }}>
                  Published investor information is loaded directly from Prestige Banking.
                </Typography>
              </Stack>
              {investors.length === 1 ? (
                <TestimonialStage investors={investors} />
              ) : (
                <InvestorCards investors={investors} />
              )}
              {!investors.length && (
                <Typography sx={{ mt: 5, color: '#456B5A' }}>
                  No investor updates are currently published.
                </Typography>
              )}
            </Reveal>
          </Container>
        </Box>
        <Box id="contact" sx={{ bgcolor: '#F8FCF9', color: '#123C2D', py: { xs: 9, md: 13 } }}>
          <Container maxWidth="xl">
            <Reveal>
              <Stack alignItems="center" textAlign="center">
                <Typography sx={{ color: '#178A68', font: '11px DM Mono', letterSpacing: '.14em' }}>
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
                  <Typography sx={{ mt: 2, maxWidth: 620, color: '#456B5A', lineHeight: 1.7 }}>
                    {contact.contentBody}
                  </Typography>
                )}
                {(contact?.contactEmail || contact?.contactPhone) && (
                  <Typography sx={{ mt: 1.5, color: '#178A68' }}>
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
                    bgcolor: '#178A68',
                    color: '#fff',
                    '&:hover': { bgcolor: '#126F55' },
                  }}
                >
                  Access your account
                </Button>
              </Stack>
            </Reveal>
          </Container>
        </Box>
        <PublicFooter />
      </Box>
    </Box>
  );
};
export default HomePage;
