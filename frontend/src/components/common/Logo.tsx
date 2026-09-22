import { Typography } from '@mui/material';
import Image from 'components/base/Image';
import { Fragment } from 'react/jsx-runtime';

const Logo = () => {
  return (
    <Fragment>
      <Image src="/bankdash/bankdash.svg" alt="Prestige Banking" sx={{ width: 31, height: 36 }} />
      <Typography
        sx={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '-0.06em',
          color: 'inherit',
        }}
      >
        prestige
      </Typography>
    </Fragment>
  );
};

export default Logo;
