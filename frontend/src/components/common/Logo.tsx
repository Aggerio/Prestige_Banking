import { Typography } from '@mui/material';
import Image from 'components/base/Image';
import { Fragment } from 'react/jsx-runtime';

const Logo = () => {
  return (
    <Fragment>
      <Image src="/bankdash/bankdash.svg" alt="Prestige Banking" sx={{ width: 38, height: 44 }} />
      <Typography
        variant="h2"
        sx={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.04em', color: '#2D3E81' }}
      >
        Prestige Banking
      </Typography>
    </Fragment>
  );
};

export default Logo;
