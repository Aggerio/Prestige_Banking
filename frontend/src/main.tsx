import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/useBreakpoints';
import { AuthProvider } from 'providers/AuthProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';
import { theme } from 'theme/theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BreakpointsProvider>
        <AuthProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </AuthProvider>
      </BreakpointsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
