import { Stack, Typography } from '@mui/material';
import CreditCard, { CreditCardData } from 'components/sections/dashboard/creditCards/CreditCard';
import { Fragment } from 'react/jsx-runtime';
import SimpleBar from 'simplebar-react';
import { useDashboard } from 'providers/DashboardProvider';

/* ---------------------------- Credit Card Data----------------------------- */
interface CardData {
  theme: 'blue' | 'white';
  data: CreditCardData;
  id: number;
}
const MyCards = () => {
  const { cards, selectedAccount, selectAccount } = useDashboard();
  const cardData: CardData[] = cards.map((card, index) => ({
    id: card.cardId,
    theme: card.accountNumber === selectedAccount || index === 0 ? 'blue' : 'white',
    data: {
      balance: String(card.availableBalance),
      cardHolder: card.cardholderName,
      validThru: `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`,
      cardNumber: card.maskedPan,
    },
  }));
  return (
    <Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 3, pb: 2.5 }}
      >
        <Typography
          sx={{
            fontSize: { xs: 'body2.fontSize', md: 'h6.fontSize', xl: 'h3.fontSize' },
            fontWeight: 600,
          }}
        >
          My Cards
        </Typography>
      </Stack>
      <SimpleBar style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" gap={4} sx={{ minWidth: 800 }}>
          {cardData.map((card) => (
            <Stack
              key={card.id}
              onClick={() =>
                selectAccount(cards.find((item) => item.cardId === card.id)?.accountNumber || '')
              }
              sx={{
                cursor: 'pointer',
                minWidth: 0,
                borderRadius: 2,
                transition: 'transform 220ms ease, filter 220ms ease',
                transform: card.theme === 'blue' ? 'translateY(-3px)' : 'translateY(0)',
                filter: card.theme === 'blue' ? 'none' : 'saturate(.78)',
                '&:hover': { transform: 'translateY(-7px)' },
              }}
            >
              <CreditCard theme={card.theme} cardData={card.data} />
            </Stack>
          ))}
        </Stack>
      </SimpleBar>
    </Fragment>
  );
};

export default MyCards;
