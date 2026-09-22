import { Box, Link, Stack, Typography } from '@mui/material';
import Logo from 'components/common/Logo';
import PageEnter from 'components/common/PageEnter';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <Stack direction="row" sx={{ minHeight: '100vh', bgcolor: '#0C1311', color: 'common.white' }}>
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '47%',
        p: 6,
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,.08)',
        position: 'relative',
        overflow: 'hidden',
        '@keyframes loginCardFloat': {
          '0%,100%': { transform: 'translate3d(0,0,0) rotate(-7deg)' },
          '50%': { transform: 'translate3d(0,-14px,0) rotate(-5deg)' },
        },
        '@keyframes loginReceiptFloat': {
          '0%,100%': { transform: 'translate3d(0,0,0) rotate(6deg)' },
          '50%': { transform: 'translate3d(9px,8px,0) rotate(4deg)' },
        },
        '@keyframes loginOrbit': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        '@keyframes loginPulse': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(155,230,201,.42)' },
          '50%': { boxShadow: '0 0 0 10px rgba(155,230,201,0)' },
        },
        '@media (prefers-reduced-motion: reduce)': { '& *': { animation: 'none !important' } },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 620,
          height: 620,
          borderRadius: '50%',
          bgcolor: '#1E5846',
          filter: 'blur(150px)',
          opacity: 0.35,
          left: -260,
          bottom: -250,
        }}
      />
      <Link href="/" sx={{ color: 'common.white', display: 'flex', position: 'relative' }}>
        <Logo />
      </Link>
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          translate: '-50% 0',
          width: { md: 350, lg: 420 },
          height: 360,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 4,
            border: '1px solid rgba(155,230,201,.2)',
            borderRadius: '50%',
            animation: 'loginOrbit 23s linear infinite',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#9BE6C9',
              top: '9%',
              left: '16%',
              boxShadow: '0 0 18px #9BE6C9',
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 55,
            border: '1px dashed rgba(155,230,201,.16)',
            borderRadius: '50%',
            animation: 'loginOrbit 31s linear infinite reverse',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 86,
            left: 26,
            width: { md: 270, lg: 325 },
            height: 182,
            p: 2.4,
            background: 'linear-gradient(135deg, #2A493D, #13231E 72%)',
            border: '1px solid rgba(184,231,208,.35)',
            color: '#EDF7F1',
            boxShadow: '17px 27px 45px rgba(0,0,0,.3)',
            animation: 'loginCardFloat 6.4s ease-in-out infinite',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '-30% auto -30% -20%',
              width: '26%',
              bgcolor: 'rgba(205,255,230,.15)',
              transform: 'skewX(-18deg)',
              animation: 'loginOrbit 9s linear infinite',
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ font: '10px DM Mono', letterSpacing: '.12em', color: '#B4E6CE' }}>
              PRESTIGE
            </Typography>
            <Typography sx={{ font: '10px DM Mono', color: '#B4E6CE' }}>VISA</Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: 'Space Grotesk',
              fontSize: { md: 24, lg: 29 },
              letterSpacing: '.1em',
              mt: 4,
            }}
          >
            •••• 4432
          </Typography>
          <Stack direction="row" justifyContent="space-between" mt={3}>
            <Typography sx={{ font: '9px DM Mono', color: '#B4CBBF' }}>AGAM GUPTA</Typography>
            <Typography sx={{ font: '9px DM Mono', color: '#B4CBBF' }}>09 / 29</Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 244,
            right: 2,
            width: 174,
            p: 1.5,
            bgcolor: '#E9F0EC',
            color: '#16251E',
            boxShadow: '10px 18px 29px rgba(0,0,0,.25)',
            animation: 'loginReceiptFloat 7.1s ease-in-out infinite',
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ font: '8px DM Mono', letterSpacing: '.1em' }}>SESSION</Typography>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#178A68',
                animation: 'loginPulse 2.5s ease-out infinite',
              }}
            />
          </Stack>
          <Typography sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, mt: 0.8 }}>
            Protected
          </Typography>
          <Typography sx={{ fontSize: 10, color: '#5F7067', mt: 0.5 }}>
            Security checks active
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 'auto', position: 'relative', maxWidth: 470 }}>
        <Typography sx={{ color: '#9BE6C9', font: '11px DM Mono', letterSpacing: '.14em' }}>
          YOUR FINANCES, IN FOCUS
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Fraunces',
            fontWeight: 500,
            fontSize: { md: 46, lg: 58 },
            lineHeight: 0.99,
            letterSpacing: '-.06em',
            mt: 2,
          }}
        >
          A calmer way to stay in control.
        </Typography>
        <Typography sx={{ color: '#AAB7B1', mt: 3, lineHeight: 1.7 }}>
          Your accounts, cards, transfers and financial activity—one secure command desk.
        </Typography>
      </Box>
    </Box>
    <Stack sx={{ flex: 1, p: { xs: 3, sm: 5, md: 7 }, minWidth: 0 }}>
      <Link href="/" sx={{ display: { md: 'none' }, color: 'common.white', mb: 7 }}>
        <Logo />
      </Link>
      <Stack sx={{ flex: 1, justifyContent: 'center', maxWidth: 430, width: 1, mx: 'auto' }}>
        <PageEnter>
          <Outlet />
        </PageEnter>
      </Stack>
      <Typography variant="caption" sx={{ color: '#7F9188', mt: 4 }}>
        © 2026 Prestige Banking · Protected banking session
      </Typography>
    </Stack>
  </Stack>
);
export default AuthLayout;
