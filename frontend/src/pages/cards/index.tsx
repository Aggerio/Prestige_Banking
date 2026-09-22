import { Box, Grid, Stack, Typography } from '@mui/material';
import CreditCard from 'components/sections/dashboard/creditCards/CreditCard';
import { useDashboard } from 'providers/DashboardProvider';

const CardsPage = () => {
  const { cards, selectedAccount, selectAccount } = useDashboard();
  return (
    <Box sx={{ py: { xs: 2.5, md: 3.5 } }}>
      <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main' }}>
        YOUR MONEY / CARDS
      </Typography>
      <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em', mt: 1 }}>
        Cards
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={4}>
        Select a card to make it the active account for activity and transfers.
      </Typography>
      <Grid container spacing={2.5}>
        {cards.map((card) => {
          const active = card.accountNumber === selectedAccount;
          return (
            <Grid item xs={12} sm={6} xl={4} key={card.cardId}>
              <Stack
                onClick={() => selectAccount(card.accountNumber)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  outline: active ? '2px solid' : '2px solid transparent',
                  outlineColor: 'primary.main',
                  outlineOffset: 5,
                  transition: 'transform 220ms ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CreditCard
                  theme={active ? 'blue' : 'white'}
                  cardData={{
                    balance: String(card.availableBalance),
                    cardHolder: card.cardholderName,
                    validThru: `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`,
                    cardNumber: card.maskedPan,
                  }}
                />
                <Typography variant="caption" color="text.secondary" mt={1.5}>
                  {card.cardType} · {card.status}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export default CardsPage;
