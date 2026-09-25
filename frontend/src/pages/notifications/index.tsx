import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import TransactionImage from 'assets/transaction-money.svg';
import IconifyIcon from 'components/base/IconifyIcon';
import dayjs from 'dayjs';
import { useNotifications } from 'providers/NotificationProvider';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { items, unreadCount, hasMore, loadMore, markRead } = useNotifications();
  const navigate = useNavigate();

  const openNotification = (id: number, reference: string, isRead: boolean) => {
    if (!isRead) void markRead(id);
    navigate(`/transactions?reference=${encodeURIComponent(reference)}`);
  };

  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 }, maxWidth: 980 }}>
      <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em' }}>
        Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={4}>
        {unreadCount
          ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`
          : 'You are all caught up.'}
      </Typography>

      <Card sx={{ overflow: 'hidden' }}>
        {items.map((notification, index) => (
          <Box key={notification.id}>
            <Stack
              component="button"
              type="button"
              direction="row"
              gap={2}
              onClick={() =>
                openNotification(
                  notification.id,
                  notification.transferReference,
                  Boolean(notification.readAt),
                )
              }
              sx={{
                width: 1,
                textAlign: 'left',
                cursor: 'pointer',
                border: 0,
                p: { xs: 2, sm: 2.5 },
                bgcolor: notification.readAt ? 'transparent' : 'rgba(23,138,104,.06)',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box
                component="img"
                src={TransactionImage}
                alt=""
                sx={{ width: 42, height: 42, flexShrink: 0 }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontWeight={800}>{notification.title}</Typography>
                <Typography color="text.secondary" mt={0.25}>
                  {notification.body}
                </Typography>
                <Stack
                  direction="row"
                  gap={0.5}
                  alignItems="center"
                  mt={0.75}
                  color="text.secondary"
                >
                  <IconifyIcon icon="solar:clock-circle-linear" width={16} />
                  <Typography variant="caption">
                    {dayjs(notification.createdAt).format('MMM D, YYYY h:mm A')}
                  </Typography>
                </Stack>
              </Box>
              {!notification.readAt && (
                <Box
                  sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 1 }}
                />
              )}
            </Stack>
            {index < items.length - 1 && <Divider />}
          </Box>
        ))}
        {!items.length && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <IconifyIcon icon="solar:bell-off-linear" width={42} color="#79958A" />
            <Typography mt={1.5} color="text.secondary">
              No notifications yet.
            </Typography>
          </Box>
        )}
      </Card>

      {hasMore && (
        <Button variant="outlined" onClick={() => void loadMore()} sx={{ mt: 3 }}>
          Load older notifications
        </Button>
      )}
    </Box>
  );
};

export default NotificationsPage;
