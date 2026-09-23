import { Box, Typography } from '@mui/material';
import prestigeBankingLogo from 'assets/prestige-banking-logo-transparent.png';
import { Fragment } from 'react/jsx-runtime';

interface LogoProps {
  light?: boolean;
  size?: 'default' | 'large';
}

const Logo = ({ light = false, size = 'default' }: LogoProps) => {
  const large = size === 'large';

  return (
    <Fragment>
      <Box
        role="img"
        aria-label="Prestige Banking"
        sx={{
          width: large ? 48 : 36,
          height: large ? 54 : 42,
          flexShrink: 0,
          backgroundImage: `url(${prestigeBankingLogo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: large ? '94px 94px' : '72px 72px',
          backgroundPosition: large ? 'center -5px' : 'center -4px',
          filter: light ? 'brightness(0) invert(1)' : 'none',
        }}
      />
      <Typography
        sx={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: large ? { xs: 20, xl: 22 } : { xs: 17, xl: 19 },
          fontWeight: 500,
          letterSpacing: '-0.04em',
          lineHeight: 1.02,
          color: light ? 'common.white' : 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        Prestige
        <Box component="span" sx={{ display: 'block' }}>
          Banking
        </Box>
      </Typography>
    </Fragment>
  );
};

export default Logo;
