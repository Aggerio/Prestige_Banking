import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const DrawerComponent: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  defaultProps: {},
  styleOverrides: {
    paper: () => ({
      background: '#13201D',
      color: '#D6E1DC',
      borderRightWidth: 1,
      borderColor: 'rgba(255,255,255,.08)',
    }),
    // docked: ({ theme }) => ({
    //   background: theme.palette.common.black,
    // }),
  },
};

export default DrawerComponent;
