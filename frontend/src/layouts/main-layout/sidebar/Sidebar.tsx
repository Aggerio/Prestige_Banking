import { Box, Button, Divider, Drawer, IconButton, List, Toolbar, Tooltip } from '@mui/material';
import Logo from 'components/common/Logo';
import IconifyIcon from 'components/base/IconifyIcon';
import { menuLinks } from 'layouts/main-layout/sidebar/MenuLinks';
import MenuListItem from 'layouts/main-layout/sidebar/MenuListItem';
import { useAuth } from 'providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
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
  const { logout } = useAuth();
  const navigate = useNavigate();
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
              transition: 'background-color 200ms ease',
              '&:hover': { bgcolor: 'rgba(142,231,194,.14)' },
            }}
          >
            <IconifyIcon icon="mingcute:menu-line" width={21} />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,.08)', mx: collapsed ? 1.75 : 2.75 }} />

      <SimpleBar style={{ maxHeight: 'calc(100vh - 178px)' }}>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: collapsed ? 1.5 : 2,
            pt: 3,
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

      <Box sx={{ mt: 'auto', mx: collapsed ? 1.5 : 2.5, mb: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          aria-label="Logout"
          startIcon={!collapsed ? <IconifyIcon icon="solar:logout-2-linear" /> : undefined}
          onClick={() => void logout().finally(() => navigate('/authentication/login'))}
          sx={{
            minWidth: 0,
            minHeight: 44,
            px: collapsed ? 1 : 2,
            borderColor: 'rgba(255,112,126,.45)',
            color: '#FF9AA5',
            '&:hover': {
              borderColor: '#FF9AA5',
              bgcolor: 'rgba(255,112,126,.1)',
            },
          }}
        >
          {collapsed ? <IconifyIcon icon="solar:logout-2-linear" width={20} /> : 'Logout'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
