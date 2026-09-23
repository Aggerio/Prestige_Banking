import BreakpointsProvider from 'providers/useBreakpoints';
import { AuthProvider } from 'providers/AuthProvider';
import { ThemeModeProvider } from 'providers/ThemeModeProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <BreakpointsProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </BreakpointsProvider>
    </ThemeModeProvider>
  </React.StrictMode>,
);
