import { Box, Stack } from '@mui/material';
import MainNavbar from 'layouts/main-layout/appbar/Appbar';
import MobileSidebar from 'layouts/main-layout/sidebar/MobileSidebar';
import Sidebar from 'layouts/main-layout/sidebar/Sidebar';
import ChatbotWidget from 'components/common/ChatbotWidget';
import { PropsWithChildren, useState } from 'react';

const drawerWidth = { lg: 288, md: 288, sm: 280 };

const MainLayout = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Sidebar
          drawerWidth={drawerWidth}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
        <MobileSidebar
          onDrawerClose={handleDrawerClose}
          onDrawerTransitionEnd={handleDrawerTransitionEnd}
          mobileOpen={mobileOpen}
          drawerWidth={drawerWidth.lg}
        />

        <Stack
          sx={{
            display: 'flex',
            flexGrow: 1,
            width: 1,
            maxWidth: {
              xs: 1,
              md: `calc(100% - ${sidebarCollapsed ? 92 : drawerWidth.lg}px)`,
              lg: `calc(100% - ${sidebarCollapsed ? 92 : drawerWidth.lg}px)`,
            },
            transition: 'max-width 320ms cubic-bezier(.2,.8,.2,1)',
            justifyContent: 'space-between',
          }}
        >
          <MainNavbar onDrawerToggle={handleDrawerToggle} />
          <Stack
            sx={{
              backgroundColor: 'background.default',
              px: { xs: 2, md: 4, xl: 5 },
              flex: 1,
              gap: 1,
            }}
          >
            {children}
          </Stack>
        </Stack>
      </Box>
      <ChatbotWidget />
    </>
  );
};

export default MainLayout;
