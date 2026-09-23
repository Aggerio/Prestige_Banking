import { Stack, Typography } from '@mui/material';
import CreditCard, { CreditCardData } from 'components/sections/dashboard/creditCards/CreditCard';
import { Fragment } from 'react/jsx-runtime';
import SimpleBar from 'simplebar-react';
import { useDashboard } from 'providers/DashboardProvider';

/* ---------------------------- Credit Card Data----------------------------- */
interface CardData {
  data: CreditCardData;
  id: number;
}
const MyCards = () => {
  const { cards, selectedAccount, selectAccount } = useDashboard();
  const cardData: CardData[] = cards.map((card) => ({
    id: card.cardId,
    data: {
      balance: String(card.availableBalance),
      cardHolder: card.cardholderName,
      validThru: `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`,
      cardNumber: card.maskedPan,
      cardType: card.cardType,
      status: card.status,
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
        <Stack direction="row" gap={4} sx={{ minWidth: 'max-content', pb: 1 }}>
          {cardData.map((card) => (
            <Stack
              key={card.id}
              role="button"
              aria-pressed={
                cards.find((item) => item.cardId === card.id)?.accountNumber === selectedAccount
              }
              tabIndex={0}
              onClick={() =>
                selectAccount(cards.find((item) => item.cardId === card.id)?.accountNumber || '')
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  selectAccount(cards.find((item) => item.cardId === card.id)?.accountNumber || '');
                }
              }}
              sx={{
                cursor: 'pointer',
                width: { xs: 340, sm: 420, xl: 460 },
                flex: '0 0 auto',
                borderRadius: 2,
                transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)',
                '&:hover': { transform: 'translateY(-5px)' },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              <CreditCard theme="blue" cardData={card.data} />
            </Stack>
          ))}
        </Stack>
      </SimpleBar>
    </Fragment>
  );
};

export default MyCards;
