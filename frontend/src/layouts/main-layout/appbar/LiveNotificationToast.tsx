import { Avatar, Box, Snackbar, Stack, Typography } from '@mui/material';
import TransactionImage from 'assets/transaction-money.svg';
import { useNotifications } from 'providers/NotificationProvider';
import { useNavigate } from 'react-router-dom';

const LiveNotificationToast = () => {
  const { liveNotification, dismissLiveNotification, markRead } = useNotifications();
  const navigate = useNavigate();
  const openDetails = () => {
    if (!liveNotification) return;
    if (!liveNotification.readAt) void markRead(liveNotification.id);
    navigate(`/transactions?reference=${encodeURIComponent(liveNotification.transferReference)}`);
    dismissLiveNotification();
  };
  return (
    <Snackbar
      open={Boolean(liveNotification)}
      autoHideDuration={7000}
      onClose={dismissLiveNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openDetails();
        }}
        sx={{
          width: 340,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          borderRadius: 2.5,
          boxShadow: 8,
          p: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={TransactionImage} sx={{ width: 42, height: 42, bgcolor: 'error.lighter' }} />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography fontWeight={700}>{liveNotification?.title}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {liveNotification?.body}
            </Typography>
            <Typography variant="caption" color="primary.main">
              View transaction details
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Snackbar>
  );
};
export default LiveNotificationToast;
