import { Box, Button, Container, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Logo from 'components/common/Logo';
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

const testimonials = [
  {
    quote:
      'I no longer open my banking app hoping I’ll eventually find what I need. Everything is already in the right place.',
    name: 'Rhea Kapoor',
    initials: 'RK',
    detail: 'Prestige customer since 2021',
    reflection:
      'Small decisions add up. So does a banking experience that respects your attention.',
  },
  {
    quote:
      'The transfer flow gives me the context I need before I move money. It feels intentional, never rushed.',
    name: 'Arjun Malhotra',
    initials: 'AM',
    detail: 'Prestige customer since 2022',
    reflection: 'Confidence comes from seeing the whole decision, not from adding more steps.',
  },
  {
    quote:
      'I can finally see how my weeks fit together—my balance, my cards and the patterns behind them.',
    name: 'Naina Shah',
    initials: 'NS',
    detail: 'Prestige customer since 2020',
    reflection: 'A quieter surface leaves room for better financial habits to take hold.',
  },
];

const TestimonialStage = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % testimonials.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);
  const item = testimonials[active];
  return (
    <Box
      sx={{
        mt: 7,
        borderTop: '1px solid rgba(255,255,255,.17)',
        borderBottom: '1px solid rgba(255,255,255,.17)',
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
              {item.quote}
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
              {item.initials}
            </Box>
            <Box>
              <Typography fontWeight={700}>{item.name}</Typography>
              <Typography variant="caption" sx={{ color: '#8FA299' }}>
                {item.detail}
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
            {item.reflection}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="end">
            <Stack direction="row" gap={1}>
              {testimonials.map((testimonial, index) => (
                <Box
                  key={testimonial.name}
                  component="button"
                  aria-label={`Show feedback from ${testimonial.name}`}
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
              0{active + 1} / 0{testimonials.length}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const HomePage = () => (
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
      <Container maxWidth="xl">
        <Stack
          component="header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2.75}
          sx={{ borderBottom: 1, ...rule }}
        >
          <Stack direction="row" alignItems="center" color="common.white">
            <Logo />
          </Stack>
          <Stack direction="row" gap={{ xs: 1, sm: 3 }} alignItems="center">
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', sm: 'block' }, color: '#8FA299' }}
            >
              Personal banking
            </Typography>
            <Button
              component={RouterLink}
              to="/authentication/login"
              variant="outlined"
              sx={{
                color: '#B8D4C7',
                borderColor: '#456156',
                '&:hover': { borderColor: '#A8E6CB', bgcolor: 'rgba(155,230,201,.06)' },
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Container>
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          minHeight: { md: 650 },
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
            top: { xs: 58, md: 88 },
            right: { xs: -80, md: '3%' },
            width: { xs: 360, md: 630 },
            height: { xs: 360, md: 570 },
            opacity: { xs: 0.48, md: 1 },
            pointerEvents: 'none',
          }}
        >
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
                PRESTIGE
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
              •••• 4432
            </Typography>
            <Stack direction="row" justifyContent="space-between" mt={{ xs: 2, md: 3 }}>
              <Typography sx={{ font: '9px DM Mono', color: '#9EB6AA' }}>AGAM GUPTA</Typography>
              <Typography sx={{ fontFamily: 'Fraunces', fontSize: 17 }}>VISA</Typography>
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
              <Typography sx={{ font: '9px DM Mono', letterSpacing: '.12em' }}>TRANSFER</Typography>
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
              ₹ 12,440.00
            </Typography>
            <Stack direction="row" justifyContent="space-between" mt={1.4}>
              <Typography variant="caption">Taj Hotels</Typography>
              <Typography variant="caption" color="#178A68">
                Complete
              </Typography>
            </Stack>
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
            PRESTIGE PERSONAL BANKING / 01
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
            Money,
            <br />
            made clearer.
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
            A quieter way to move, understand, and protect your money—designed around what matters
            next.
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
                <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: '#9BE6C9' }}>
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
      <Box sx={{ bgcolor: '#E9F0EC', color: '#14231C', py: { xs: 8, md: 13 }, overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Reveal>
            <Typography sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#178A68' }}>
              THE COMMAND DESK / 02
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
                  fontSize: { xs: 42, md: 62 },
                  lineHeight: 0.98,
                  letterSpacing: '-.065em',
                }}
              >
                Everything important, without everything else.
              </Typography>
              <Typography
                sx={{ maxWidth: 360, alignSelf: { lg: 'end' }, color: '#52665C', lineHeight: 1.7 }}
              >
                The everyday banking tools you actually use, arranged as a clear sequence rather
                than a crowded dashboard.
              </Typography>
            </Stack>
          </Reveal>
          <Box sx={{ mt: { xs: 6, md: 9 }, borderTop: '1px solid #B9C8C0' }}>
            {[
              [
                '01',
                'Move money with intent',
                'Transfers show the source, recipient, IFSC details and amount in one deliberate flow.',
                'solar:transfer-horizontal-bold',
              ],
              [
                '02',
                'See the shape of your spending',
                'Balance history, weekly activity and expense patterns turn daily decisions into a useful picture.',
                'solar:chart-2-bold',
              ],
              [
                '03',
                'Keep every account close',
                'Choose a card, view transactions or check your available balance without leaving your flow.',
                'solar:wallet-money-bold',
              ],
            ].map(([n, title, body, icon], index) => (
              <Reveal key={n} delay={index * 110}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ md: 'center' }}
                  gap={2}
                  sx={{
                    py: { xs: 3, md: 4 },
                    borderBottom: '1px solid #B9C8C0',
                    transition: 'padding .28s ease, background-color .28s ease',
                    '&:hover': { px: { md: 2 }, bgcolor: '#DCE8E1' },
                  }}
                >
                  <Typography sx={{ width: { md: 90 }, font: '11px DM Mono', color: '#178A68' }}>
                    {n}
                  </Typography>
                  <Typography
                    sx={{
                      flex: 1,
                      fontFamily: 'Fraunces',
                      fontSize: { xs: 29, md: 38 },
                      letterSpacing: '-.05em',
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ maxWidth: 300, color: '#52665C', lineHeight: 1.6 }}>
                    {body}
                  </Typography>
                  <Box
                    className="reveal-pop"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      width: { md: 155 },
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
                    LIVE IN COMMAND DESK
                  </Box>
                  <IconifyIcon icon={icon} width={28} color="#178A68" />
                </Stack>
              </Reveal>
            ))}
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
                <Typography sx={{ font: '11px DM Mono', letterSpacing: '.14em', color: '#9BE6C9' }}>
                  LIVED EXPERIENCE
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
                  A bank that doesn’t
                  <br />
                  feel like a chore.
                </Typography>
              </Box>
              <Typography sx={{ maxWidth: 320, color: '#9AADA3', lineHeight: 1.65 }}>
                A quieter surface means less time finding things and more confidence in what you do
                next.
              </Typography>
            </Stack>
            <TestimonialStage />
            <Box
              sx={{
                mt: 7,
                display: 'none',
                gridTemplateColumns: { xs: '1fr', md: '1.1fr .9fr' },
                borderTop: '1px solid rgba(255,255,255,.17)',
                borderBottom: '1px solid rgba(255,255,255,.17)',
              }}
            >
              <Box
                sx={{
                  py: { xs: 4, md: 6 },
                  pr: { md: 7 },
                  borderRight: { md: '1px solid rgba(255,255,255,.17)' },
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
                  I no longer open my banking app hoping I’ll eventually find what I need.
                  Everything is already in the right place.
                </Typography>
                <Stack direction="row" gap={1.5} alignItems="center" mt={4}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '50%',
                      bgcolor: '#9BE6C9',
                      color: '#10251D',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    RK
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>Rhea Kapoor</Typography>
                    <Typography variant="caption" sx={{ color: '#8FA299' }}>
                      Prestige customer since 2021
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Stack
                sx={{ py: { xs: 4, md: 6 }, pl: { md: 7 } }}
                justifyContent="space-between"
                gap={5}
              >
                <Typography
                  sx={{
                    fontFamily: 'Fraunces',
                    fontSize: { xs: 26, md: 33 },
                    letterSpacing: '-.05em',
                    lineHeight: 1.15,
                  }}
                >
                  Small decisions add up. So does a banking experience that respects your attention.
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ color: '#9BE6C9' }}>
                  <Typography sx={{ font: '10px DM Mono', letterSpacing: '.1em' }}>
                    PRIVATE · PRECISE · PERSONAL
                  </Typography>
                  <IconifyIcon icon="solar:arrow-down-linear" width={20} />
                </Stack>
              </Stack>
            </Box>
          </Reveal>
        </Container>
      </Box>
      <Box sx={{ bgcolor: '#0B1110', color: '#EFF5F1', py: { xs: 9, md: 13 } }}>
        <Container maxWidth="xl">
          <Reveal>
            <Stack alignItems="center" textAlign="center">
              <Typography sx={{ color: '#9BE6C9', font: '11px DM Mono', letterSpacing: '.14em' }}>
                READY WHEN YOU ARE
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
                Your money deserves a clearer view.
              </Typography>
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
              <Logo />
            </Stack>
            <Typography variant="caption">
              © 2026 Prestige Banking · Built for the everyday
            </Typography>
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
export default HomePage;
