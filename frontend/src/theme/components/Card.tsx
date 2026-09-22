import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const CardComponent: Components<Omit<Theme, 'components'>>['MuiCard'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: '#FFFFFF',
      backgroundClip: 'border-box',
      borderRadius: theme.shape.borderRadius * 2,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: '0 6px 18px rgba(12, 31, 23, .045)',
    }),
  },
};

export default CardComponent;
