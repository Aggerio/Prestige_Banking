import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

/** Applies the dashboard's entrance language to standard routed pages. */
const PageEnter = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.endsWith('/dashboard');

  return (
    <Box
      key={pathname}
      sx={
        isDashboard
          ? undefined
          : {
              '@keyframes pageEnter': {
                from: { opacity: 0, transform: 'translate3d(0, 22px, 0)', filter: 'blur(5px)' },
                to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
              },
              '& > *': {
                animation: 'pageEnter 520ms cubic-bezier(.22,1,.36,1) both',
                willChange: 'opacity, transform, filter',
              },
              '& > * > *': {
                animation: 'pageEnter 620ms cubic-bezier(.22,1,.36,1) both',
              },
              '& > * > :nth-child(1)': { animationDelay: '70ms' },
              '& > * > :nth-child(2)': { animationDelay: '140ms' },
              '& > * > :nth-child(3)': { animationDelay: '210ms' },
              '& > * > :nth-child(4)': { animationDelay: '280ms' },
              '& > * > :nth-child(5)': { animationDelay: '350ms' },
              '@media (prefers-reduced-motion: reduce)': {
                '&, & *, & > *, & > * > *': { animation: 'none !important' },
              },
            }
      }
    >
      {children}
    </Box>
  );
};

export default PageEnter;
