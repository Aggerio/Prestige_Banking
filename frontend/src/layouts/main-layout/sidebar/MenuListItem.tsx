import { Link, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { menuLinks, MenuLinkType } from 'layouts/main-layout/sidebar/MenuLinks';
import { useLocation } from 'react-router-dom';
interface MenuListProps {
  menuItem: MenuLinkType;
  onDrawerClose?: () => void;
  collapsed?: boolean;
}
const MenuListItem = ({ menuItem, onDrawerClose, collapsed = false }: MenuListProps) => {
  const { icon: Icon } = menuItem;
  const itemIcon = Icon ? (
    <Icon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
  ) : null;
  const location = useLocation();

  // check if list item is active
  const isActive =
    menuItem.title === menuLinks.find((item) => item.link === location.pathname)?.title;

  const content = (
    <ListItem
      key={menuItem.id}
      sx={{
        position: 'relative',
        p: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          bgcolor: isActive ? 'primary.main' : 'transparent',
          top: 0,
          bottom: 0,
          left: collapsed ? -12 : -16,
          width: 3,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          transition: 'background-color 0.5s ease',
        },
      }}
    >
      <Link
        href={menuItem.link}
        onClick={onDrawerClose}
        sx={{
          minHeight: 56,
          py: 1.5,
          px: collapsed ? 1.75 : 2.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 2.25,
          flex: 1,
          borderRadius: 2,
          color: isActive ? '#FFFFFF' : menuItem.available ? '#9FB2AA' : 'action.disabled',
          backgroundColor: isActive ? 'rgba(118,225,184,.12)' : 'transparent',
          boxShadow: isActive ? 'inset 0 0 0 1px rgba(118,225,184,.08)' : 'none',
          transition: 'color 220ms ease, background-color 220ms ease, transform 220ms ease',
          '&:hover, &:focus': {
            backgroundColor: 'rgba(255,255,255,.07)',
            boxShadow: 'none',
            color: !menuItem.available ? 'action.disabled' : 'common.white',
            transform: 'translateX(2px)',
            '& .MuiSvgIcon-root': {
              color: !menuItem.available ? 'action.disabled' : 'common.white',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 'auto',

            color: isActive ? '#76E1B8' : menuItem.available ? '#9FB2AA' : 'action.disabled',
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              sx={{
                fontSize: { xs: 'body1.fontSize', xl: 'h6.fontSize' },
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {menuItem.title}
            </Typography>
          }
        />
      </Link>
    </ListItem>
  );

  return collapsed ? (
    <Tooltip title={menuItem.title} placement="right" arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default MenuListItem;
