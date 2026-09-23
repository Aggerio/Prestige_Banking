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
                from: { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
                to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
              },
              '& > *': {
                animation: 'pageEnter 460ms cubic-bezier(.2,.8,.2,1) both',
              },
              '& > * > *': {
                animation: 'pageEnter 560ms cubic-bezier(.2,.8,.2,1) both',
              },
              '& > * > :nth-of-type(1)': { animationDelay: '70ms' },
              '& > * > :nth-of-type(2)': { animationDelay: '140ms' },
              '& > * > :nth-of-type(3)': { animationDelay: '210ms' },
              '& > * > :nth-of-type(4)': { animationDelay: '280ms' },
              '& > * > :nth-of-type(5)': { animationDelay: '350ms' },
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
