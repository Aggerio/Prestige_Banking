import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Logo from 'components/common/Logo';
import IconifyIcon from 'components/base/IconifyIcon';
import { menuLinks } from 'layouts/main-layout/sidebar/MenuLinks';
import MenuListItem from 'layouts/main-layout/sidebar/MenuListItem';
import SimpleBar from 'simplebar-react';
interface SidebarProps {
  drawerWidth: {
    lg: number;
    md: number;
    sm: number;
  };
  collapsed: boolean;
  onToggle: () => void;
}
const Sidebar = ({ drawerWidth, collapsed, onToggle }: SidebarProps) => {
  const width = collapsed ? 92 : drawerWidth.lg;
  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          overflowX: 'hidden',
          border: 0,
          background:
            'radial-gradient(circle at 20% 0%,rgba(36,118,89,.28),transparent 32%),linear-gradient(180deg,#10241F 0%,#0A1714 100%)',
          boxShadow: '12px 0 36px rgba(3,16,12,.12)',
          transition: 'width 320ms cubic-bezier(.2,.8,.2,1)',
        },
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 2,
        py: 0,
        overflow: 'hidden',
        width,
        transition: 'width 320ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <Toolbar
        sx={{
          gap: 1.5,
          minHeight: 104,
          color: 'common.white',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1.25 : 2.75,
        }}
      >
        {!collapsed && <Logo light size="large" />}
        <Tooltip title={collapsed ? 'Open sidebar' : 'Close sidebar'} placement="right">
          <IconButton
            aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
            onClick={onToggle}
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              color: '#8EE7C2',
              border: '1px solid rgba(142,231,194,.24)',
              bgcolor: 'rgba(255,255,255,.05)',
              transition: 'transform 320ms cubic-bezier(.2,.8,.2,1), background-color 200ms ease',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              '&:hover': { bgcolor: 'rgba(142,231,194,.14)' },
            }}
          >
            <IconifyIcon icon="solar:alt-arrow-left-linear" width={19} />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,.08)', mx: collapsed ? 1.75 : 2.75 }} />

      <SimpleBar style={{ maxHeight: 'calc(100vh - 178px)' }}>
        {!collapsed && (
          <Typography
            sx={{
              px: 3.5,
              pt: 3.5,
              pb: 1.75,
              color: 'rgba(214,231,223,.48)',
              font: '600 10px DM Mono',
              letterSpacing: '.16em',
            }}
          >
            MAIN MENU
          </Typography>
        )}
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: collapsed ? 1.5 : 2,
            ...(collapsed && {
              '& .MuiListItemText-root': { display: 'none' },
              '& .MuiListItem-root a': { justifyContent: 'center', px: 1 },
            }),
          }}
        >
          {menuLinks.map((menu) => (
            <MenuListItem key={menu.id} menuItem={menu} collapsed={collapsed} />
          ))}
        </List>
      </SimpleBar>

      {!collapsed && (
        <Stack
          sx={{
            mt: 'auto',
            mx: 2.5,
            mb: 2.5,
            p: 2.25,
            borderRadius: 3,
            bgcolor: 'rgba(142,231,194,.07)',
          }}
        >
          <Box sx={{ width: 28, height: 3, borderRadius: 2, bgcolor: '#76E1B8', mb: 1.25 }} />
          <Typography sx={{ color: 'common.white', fontSize: 12, fontWeight: 700 }}>
            Secure banking
          </Typography>
          <Typography
            sx={{ mt: 0.5, color: 'rgba(214,231,223,.58)', fontSize: 10, lineHeight: 1.5 }}
          >
            Your session is protected.
          </Typography>
        </Stack>
      )}
    </Drawer>
  );
};

export default Sidebar;
