import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
} from '@mui/material';
import FemaleProfileImage from 'assets/profile-female.svg';
import MaleProfileImage from 'assets/profile-male.svg';
import IconifyIcon from 'components/base/IconifyIcon';
import { MouseEvent, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useAuth } from 'providers/AuthProvider';
import { useDashboard } from 'providers/DashboardProvider';
import { useNavigate } from 'react-router-dom';

const maleFirstNames = new Set([
  'aarav',
  'arjun',
  'rohan',
  'vihaan',
  'aditya',
  'rahul',
  'raj',
  'amit',
  'vikram',
  'karan',
]);
/* -------------------------------------------------------------------------- */
const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const { customer } = useDashboard();
  const navigate = useNavigate();
  const firstName = customer?.customerName.trim().split(/\s+/)[0]?.toLowerCase() || '';
  const profileImage = maleFirstNames.has(firstName) ? MaleProfileImage : FemaleProfileImage;

  const handleOpenDropdown = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <IconButton sx={{ p: 0, position: 'relative' }} onClick={handleOpenDropdown}>
        <Avatar
          alt={customer?.customerName || 'Customer profile'}
          src={profileImage}
          sx={{
            width: { xs: 40, md: 45, xl: 60 },
            height: { xs: 40, md: 45, xl: 60 },
            bgcolor: 'transparent',
            '& img': { objectFit: 'contain' },
          }}
        />
      </IconButton>
      {/* Profile Menu Dropdown*/}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box p={3}>
          <Typography variant="subtitle1" color="text.primary">
            User Profile
          </Typography>
          <Stack direction="row" py={2.5} spacing={1.5} alignItems="center">
            <Avatar
              src={profileImage}
              alt={customer?.customerName || 'Customer profile'}
              sx={{
                width: 65,
                height: 65,
                bgcolor: 'transparent',
                '& img': { objectFit: 'contain' },
              }}
            />
            <Box>
              <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                {customer?.customerName || 'Customer'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {customer?.status || 'ACTIVE'}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Button
            fullWidth
            startIcon={<IconifyIcon icon="solar:user-circle-linear" />}
            onClick={() => {
              handleClose();
              setProfileOpen(true);
            }}
            sx={{ my: 1.5, justifyContent: 'flex-start' }}
          >
            My profile
          </Button>
          <Box mt={1.25}>
            <Button
              onClick={() => {
                void logout().finally(() => navigate('/authentication/login'));
              }}
              variant="outlined"
              color="error"
              fullWidth
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Menu>
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Customer profile</DialogTitle>
        <DialogContent>
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <Avatar
              src={profileImage}
              alt={customer?.customerName || 'Customer profile'}
              sx={{ width: 76, height: 76, bgcolor: 'transparent' }}
            />
            <Box>
              <Typography variant="h5" color="text.primary" fontWeight={800}>
                {customer?.customerName || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer ID {customer?.customerId || '—'} · {customer?.status || '—'}
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            {[
              ['Age', customer?.age],
              ['Bank name', customer?.bank?.bankName],
              ['IFSC code', customer?.bank?.ifscCode],
              ['Branch name', customer?.bank?.branchName],
              [
                'Address',
                customer?.address
                  ? [
                      customer.address.streetName,
                      customer.address.city,
                      customer.address.state,
                      customer.address.pinCode,
                    ]
                      .filter(Boolean)
                      .join(', ')
                  : null,
              ],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  gridColumn: label === 'Address' ? { sm: '1 / -1' } : undefined,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography color="text.primary" fontWeight={700} mt={0.4}>
                  {value || '—'}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ProfileDropdown;
