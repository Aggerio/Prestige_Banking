import { createTheme, PaletteMode, Shadows } from '@mui/material';
import AppBarComponent from 'theme/components/AppBar';
import AvatarComponent from 'theme/components/Avatar';
import ButtonComponent from 'theme/components/Button';
import ButtonBaseComponent from 'theme/components/ButtonBase';
import CardComponent from 'theme/components/Card';
import CardContentComponent from 'theme/components/CardContent';
import CssBaselineComponent from 'theme/components/CssBaseline';
import DataGridComponent from 'theme/components/DataGrid';
import DrawerComponent from 'theme/components/Drawer';
import FilledInputComponent from 'theme/components/form/FilledInput';
import InputComponent from 'theme/components/form/Input';
import InputAdornmentComponent from 'theme/components/form/InputAdornment';
import InputBaseComponent from 'theme/components/form/InputBase';
import InputLabelComponent from 'theme/components/form/InputLabel';
import OutlinedInputComponent from 'theme/components/form/OutlinedInput';
import IconButtonComponent from 'theme/components/IconButton';
import LinkComponent from 'theme/components/Link';
import ListItemComponent from 'theme/components/list/ListItem';
import ListItemTextComponent from 'theme/components/list/ListItemText';
import MenuComponent from 'theme/components/list/Menu';
import PaginationComponent from 'theme/components/Pagination';
import PaginationItemComponent from 'theme/components/pagination/PaginationItem';
import TabComponent from 'theme/components/Tab';
import TabsComponent from 'theme/components/Tabs';
import ToolbarComponent from 'theme/components/Toolbar';
import TouchRippleComponent from 'theme/components/TouchRipple';
// import type {} from '@mui/x-data-grid/themeAugmentation';
import palette from 'theme/palette';
import shadows from 'theme/shadows';
import typography from 'theme/typography';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}
export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      ...palette,
      mode,
      ...(mode === 'dark' && {
        background: { default: '#07100D', paper: '#10201A' },
        text: { primary: '#F2F8F4', secondary: '#A8BAB1', disabled: '#71847B' },
        divider: 'rgba(220,240,230,.14)',
        primary: {
          lighter: '#173D2F',
          light: '#69D6AA',
          main: '#35B986',
          dark: '#A9E8CB',
          darker: '#D8F5E7',
          contrastText: '#06140F',
        },
        neutral: {
          light: '#19382D',
          main: '#A8BAB1',
          dark: '#D8E5DE',
          contrastText: '#F2F8F4',
        },
        action: {
          ...palette.action,
          active: '#C6D8CF',
          hover: 'rgba(255,255,255,.08)',
          selected: 'rgba(155,230,201,.13)',
          disabled: '#687A72',
          disabledBackground: 'rgba(255,255,255,.08)',
          focus: 'rgba(155,230,201,.22)',
        },
      }),
    },
    typography,
    shadows: [...shadows] as Shadows,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1920,
      },
    },
    components: {
      MuiAppBar: AppBarComponent,
      MuiAvatar: AvatarComponent,
      MuiButton: ButtonComponent,
      MuiButtonBase: ButtonBaseComponent,
      MuiCard: CardComponent,
      MuiCardContent: CardContentComponent,
      MuiCssBaseline: CssBaselineComponent,
      MuiDataGrid: DataGridComponent,
      MuiDrawer: DrawerComponent,
      MuiFilledInput: FilledInputComponent,
      MuiIconButton: IconButtonComponent,
      MuiInput: InputComponent,
      MuiInputBase: InputBaseComponent,
      MuiInputLabel: InputLabelComponent,
      MuiInputAdornment: InputAdornmentComponent,
      MuiLink: LinkComponent,
      MuiListItem: ListItemComponent,
      MuiListItemText: ListItemTextComponent,
      MuiMenu: MenuComponent,
      MuiOutlinedInput: OutlinedInputComponent,
      MuiPagination: PaginationComponent,
      MuiPaginationItem: PaginationItemComponent,
      MuiTab: TabComponent,
      MuiTabs: TabsComponent,
      MuiToolbar: ToolbarComponent,
      MuiTouchRipple: TouchRippleComponent,
    },
  });

export const theme = createAppTheme('light');
