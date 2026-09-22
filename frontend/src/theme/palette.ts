import { alpha, PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
import { blue, green, grey, magneta, orange, red } from './colors';

declare module '@mui/material/styles' {
  interface GradientOptions {
    [key: string]: string;
  }

  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    gradients?: GradientOptions;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    gradients: PaletteGradients;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface PaletteGradients {
    blueGradient: string;
    whiteGradient: string;
    whiteCardGradient: string;
    bgGradient: string;
  }
}

const palette: PaletteOptions = {
  action: {
    active: grey[500],
    hover: alpha(grey[600], 0.13),
    selected: grey[100],
    disabled: grey[400],
    disabledBackground: grey[200],
    focus: grey[300],
    hoverOpacity: 0.05,
  },
  background: { default: '#EEF1EF', paper: '#F7F9F8' },
  neutral: {
    light: blue[100],
    main: grey[600],
    dark: grey[800],
    contrastText: '#ffffff',
  },
  primary: {
    lighter: blue[200],
    light: blue[300],
    main: blue[500],
    dark: blue[800],
    darker: blue[900],
    contrastText: '#ffffff',
  },
  secondary: {
    lighter: magneta[100],
    main: magneta[500],
    contrastText: magneta[50],
  },
  error: { main: red[500] },
  warning: {
    light: orange[100],
    main: orange[500],
    dark: orange[700],
    contrastText: '#ffffff',
  },
  success: {
    lighter: green[50],
    light: green[300],
    main: green[500],
    dark: green[700],
    darker: green[800],
  },

  grey,
  text: { primary: '#17231E', secondary: grey[600], disabled: grey[400] },
  divider: grey[100],
  gradients: {
    blueGradient: 'linear-gradient(135deg, #1C3840 0%, #142720 100%)',
    whiteGradient: 'linear-gradient(to bottom, rgba(255, 255, 255, .1) 0%, transparent)',
    whiteCardGradient:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.15) 0%, transparent)',
    bgGradient: 'radial-gradient(circle at 75% 20%, #213D38 0%, #121B1A 42%, #0B1110 100%)',
  },
};

export default palette;
