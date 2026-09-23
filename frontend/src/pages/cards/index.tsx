import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { changeCardStatus, revealCardNumber, type Card as BankCard } from 'api/banking';
import { apiError } from 'api/client';
import CreditCard from 'components/sections/dashboard/creditCards/CreditCard';
import IconifyIcon from 'components/base/IconifyIcon';
import { useDashboard } from 'providers/DashboardProvider';
import { useState } from 'react';

const friendlyStatus = (status: string) =>
  status === 'BLOCKED' ? 'LOCKED' : status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

const CardsPage = () => {
  const { cards, selectedAccount, selectAccount, refresh } = useDashboard();
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const [statusCard, setStatusCard] = useState<BankCard | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [password, setPassword] = useState('');
  const [revealedCardNumbers, setRevealedCardNumbers] = useState<Map<number, string>>(
    () => new Map(),
  );
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredCards = cards.filter(
    (card) =>
      (typeFilter === 'ALL' || card.cardType === typeFilter) &&
      (statusFilter === 'ALL' || friendlyStatus(card.status) === statusFilter),
  );

  const resetDialog = () => {
    setPassword('');
    setError(null);
    setVerifying(false);
  };
  const closeReveal = () => {
    setSelectedCard(null);
    resetDialog();
  };
  const closeStatus = () => {
    setStatusCard(null);
    resetDialog();
  };
  const verify = async () => {
    if (!selectedCard) return;
    setVerifying(true);
    setError(null);
    try {
      const {
        data: { unmaskedPan },
      } = await revealCardNumber(selectedCard.cardId, password);
      setRevealedCardNumbers((current) => {
        const next = new Map(current);
        next.set(selectedCard.cardId, unmaskedPan);
        return next;
      });
      setNotice('Card number revealed.');
      closeReveal();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setVerifying(false);
    }
  };
  const updateStatus = async () => {
    if (!statusCard) return;
    const nextStatus = statusCard.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setVerifying(true);
    setError(null);
    try {
      await changeCardStatus(statusCard.cardId, {
        status: nextStatus,
        transactionPassword: password,
      });
      await refresh();
      setNotice(`Card ${nextStatus === 'BLOCKED' ? 'locked' : 'unlocked'} successfully.`);
      closeStatus();
    } catch (err) {
      setError(apiError(err));
      setVerifying(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 } }}>
      <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main' }}>
        YOUR MONEY / CARDS
      </Typography>
      <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em', mt: 1 }}>
        Cards
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
        gap={2}
        mt={1}
        mb={4}
      >
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
          Select a card to make it the active account for activity and transfers.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Card type</InputLabel>
            <Select
              label="Card type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="ALL">All cards</MenuItem>
              <MenuItem value="DEBIT">Debit</MenuItem>
              <MenuItem value="CREDIT">Credit</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Card status</InputLabel>
            <Select
              label="Card status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="LOCKED">Locked</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2.5 }}>
          {notice}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {filteredCards.map((card) => {
          const active = card.accountNumber === selectedAccount;
          const revealedCardNumber = revealedCardNumbers.get(card.cardId);
          return (
            <Grid item xs={12} lg={6} key={card.cardId}>
              <Stack
                onClick={() => selectAccount(card.accountNumber)}
                role="button"
                aria-pressed={active}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectAccount(card.accountNumber);
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)',
                  '&:hover': { transform: 'translateY(-4px)' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                <CreditCard
                  theme="blue"
                  cardData={{
                    balance: String(card.availableBalance),
                    cardHolder: card.cardholderName,
                    validThru: `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`,
                    cardNumber: revealedCardNumber ?? card.maskedPan,
                    cardType: card.cardType,
                    status: card.status,
                  }}
                  actions={
                    <>
                      <Tooltip
                        title={revealedCardNumber ? 'Hide card number' : 'Reveal card number'}
                      >
                        <IconButton
                          aria-label={
                            revealedCardNumber ? 'Hide card number' : 'Reveal card number'
                          }
                          onClick={() => {
                            if (revealedCardNumber) {
                              setRevealedCardNumbers((current) => {
                                const next = new Map(current);
                                next.delete(card.cardId);
                                return next;
                              });
                              return;
                            }
                            setError(null);
                            setSelectedCard(card);
                          }}
                          sx={{
                            width: 42,
                            height: 42,
                            color: '#76E1B8',
                            border: '1px solid rgba(118,225,184,.5)',
                            bgcolor: 'rgba(2,17,14,.32)',
                            '&:hover': { bgcolor: 'rgba(118,225,184,.14)' },
                          }}
                        >
                          <IconifyIcon
                            icon={
                              revealedCardNumber ? 'solar:eye-closed-linear' : 'solar:eye-linear'
                            }
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={card.status === 'ACTIVE' ? 'Lock card' : 'Unlock card'}>
                        <span>
                          <IconButton
                            aria-label={card.status === 'ACTIVE' ? 'Lock card' : 'Unlock card'}
                            disabled={card.status !== 'ACTIVE' && card.status !== 'BLOCKED'}
                            onClick={() => {
                              setError(null);
                              setStatusCard(card);
                            }}
                            sx={{
                              width: 42,
                              height: 42,
                              color: '#76E1B8',
                              border: '1px solid rgba(118,225,184,.5)',
                              bgcolor: 'rgba(2,17,14,.32)',
                              '&:hover': { bgcolor: 'rgba(118,225,184,.14)' },
                              '&.Mui-disabled': { color: 'rgba(255,255,255,.28)' },
                            }}
                          >
                            <IconifyIcon
                              icon={
                                card.status === 'ACTIVE'
                                  ? 'solar:lock-keyhole-linear'
                                  : 'solar:lock-keyhole-unlocked-linear'
                              }
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  }
                />
              </Stack>
            </Grid>
          );
        })}
        {!filteredCards.length && (
          <Grid item xs={12}>
            <Box sx={{ p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
              <Typography fontWeight={700}>No matching cards</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Change the card type or status filter to see other cards.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={Boolean(selectedCard)} onClose={closeReveal} fullWidth maxWidth="xs">
        <DialogTitle>Protected card details</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              label="Transaction password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && password) void verify();
              }}
              helperText="Your password is verified securely by the authentication service."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReveal}>Close</Button>
          <Button
            variant="contained"
            disabled={!password || verifying}
            onClick={() => void verify()}
          >
            {verifying ? 'Verifying…' : 'Verify and reveal'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(statusCard)} onClose={closeStatus} fullWidth maxWidth="xs">
        <DialogTitle>{statusCard?.status === 'ACTIVE' ? 'Lock card' : 'Unlock card'}</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="body2" color="text.secondary">
              Enter your transaction password to{' '}
              {statusCard?.status === 'ACTIVE' ? 'lock' : 'unlock'} the card ending in{' '}
              {statusCard?.maskedPan.slice(-4)}.
            </Typography>
            <TextField
              autoFocus
              required
              label="Transaction password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && password) void updateStatus();
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatus}>Cancel</Button>
          <Button
            color={statusCard?.status === 'ACTIVE' ? 'warning' : 'success'}
            variant="contained"
            disabled={!password || verifying}
            onClick={() => void updateStatus()}
          >
            {verifying
              ? 'Verifying…'
              : statusCard?.status === 'ACTIVE'
                ? 'Lock card'
                : 'Unlock card'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardsPage;
