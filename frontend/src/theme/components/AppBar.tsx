import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AppBarComponent: Components<Omit<Theme, 'components'>>['MuiAppBar'] = {
  defaultProps: { elevation: 0 },
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: 'none',
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    }),
  },
};

export default AppBarComponent;
