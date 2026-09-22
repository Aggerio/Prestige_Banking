import { Drawer, List, Toolbar } from '@mui/material';
import Logo from 'components/common/Logo';
import { menuLinks } from 'layouts/main-layout/sidebar/MenuLinks';
import MenuListItem from 'layouts/main-layout/sidebar/MenuListItem';
import SimpleBar from 'simplebar-react';
interface SidebarProps {
  drawerWidth: {
    lg: number;
    md: number;
    sm: number;
  };
}
const Sidebar = ({ drawerWidth }: SidebarProps) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: {
            xs: drawerWidth.sm,
            lg: drawerWidth.md,
            xl: drawerWidth.lg,
          },
        },
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 2,
        py: 2.5,
        overflow: 'hidden',
        width: {
          xs: drawerWidth.sm,
          lg: drawerWidth.md,
          xl: drawerWidth.lg,
        },
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 72, cursor: 'pointer', color: 'common.white' }}>
        <Logo />
      </Toolbar>

      <SimpleBar style={{ maxHeight: 'calc(100vh - 100px)' }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 1 }}>
          {menuLinks.map((menu) => (
            <MenuListItem key={menu.id} menuItem={menu} />
          ))}
        </List>
      </SimpleBar>
    </Drawer>
  );
};

export default Sidebar;
