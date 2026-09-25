import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import TransactionImage from 'assets/transaction-money.svg';
import IconifyIcon from 'components/base/IconifyIcon';
import dayjs from 'dayjs';
import { Fragment } from 'react/jsx-runtime';
import SimpleBar from 'simplebar-react';
import { useNotifications } from 'providers/NotificationProvider';
import { useNavigate } from 'react-router-dom';
interface NotificationDropdownProps {
  onClose: () => void;
  open: null | HTMLElement;
}
const NotificationDropdown = ({ open, onClose }: NotificationDropdownProps) => {
  const { items, unreadCount, markRead } = useNotifications();
  const navigate = useNavigate();
  const openNotification = (id: number, reference: string, isRead: boolean) => {
    if (!isRead) void markRead(id);
    onClose();
    navigate(`/transactions?reference=${encodeURIComponent(reference)}`);
  };

  return (
    <Fragment>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: { xs: 'calc(100vw - 32px)', sm: 400 },
              maxWidth: 400,
              bgcolor: 'background.paper',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(20,58,45,.18)',
            },
          },
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', py: 2, px: 2.5 }}>
          <Stack gap={1} sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Notifications
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              You have {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <SimpleBar style={{ maxHeight: 360 }}>
          <List disablePadding dense>
            {items.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() =>
                  openNotification(
                    notification.id,
                    notification.transferReference,
                    Boolean(notification.readAt),
                  )
                }
                sx={{
                  py: 1.25,
                  px: 2.5,
                  mt: '1px',
                  bgcolor: notification.readAt ? 'transparent' : 'rgba(23,138,104,.06)',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: 'action.disabledBackground', width: 35, height: 35 }}
                    src={TransactionImage}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="button"
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'text.secondary' }}
                      >
                        {notification.body}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <IconifyIcon
                          icon="flat-color-icons:clock"
                          sx={{ mr: 0.5, width: 16, height: 16 }}
                        />
                        {dayjs(notification.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            ))}
            {!items.length && (
              <Box sx={{ py: 5, px: 2.5, textAlign: 'center' }}>
                <Typography color="text.secondary">You are all caught up.</Typography>
              </Box>
            )}
          </List>
        </SimpleBar>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            color="primary"
            onClick={() => {
              onClose();
              navigate('/notifications');
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default NotificationDropdown;
