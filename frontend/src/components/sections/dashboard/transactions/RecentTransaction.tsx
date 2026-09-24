import { Card, List, ListItem, Stack, Typography } from '@mui/material';
import CardContainer from 'components/common/CardContainter';
import CoinIcon from 'components/icons/card-icons/CoinIcon';
import CreditCardIcon from 'components/icons/card-icons/CreditCardIcon';
import PaypalIcon from 'components/icons/card-icons/PaypalIcon';
import { currencyFormat } from 'helpers/utils';
import { useDashboard } from 'providers/DashboardProvider';

const RecentTransactions = () => {
  const { transactions: apiTransactions } = useDashboard();
  const transactions = apiTransactions.slice(0, 3).map((transaction, index) => ({
    id: transaction.transactionId,
    icon: index === 0 ? CreditCardIcon : index === 1 ? PaypalIcon : CoinIcon,
    bgcolor: index === 0 ? 'warning.light' : 'neutral.light',
    title: transaction.remarks || transaction.referenceNumber,
    type: transaction.movement === 'DEPOSIT' ? 'credit' : 'debit',
    date: new Date(transaction.transactionAt).toLocaleDateString(),
    amount: transaction.amount,
    amountColor: transaction.movement === 'DEPOSIT' ? 'success.main' : 'error.main',
  }));
  return (
    <CardContainer title="Recent Transactions">
      <Card sx={{ p: { xs: 0.5, xl: 1 } }}>
        <List disablePadding sx={{ color: 'primary.main', '& > *:not(:last-child)': { mb: 2.5 } }}>
          {transactions.map(
            ({ id, icon: IconComponent, bgcolor, title, date, amount, type, amountColor }) => (
              <ListItem
                key={id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  '&:hover': {
                    '& .title': {
                      color: 'text.secondary',
                    },
                    '& .date': {
                      color: 'neutral.main',
                      transform: 'translateX(2px)',
                    },
                  },
                }}
                disablePadding
              >
                <Stack
                  direction="row"
                  sx={{
                    width: 55,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bgcolor,
                    borderRadius: '50%',
                  }}
                >
                  <IconComponent sx={{ mb: 0.75 }} />
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    flexGrow: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Stack gap={1}>
                    <Typography
                      className="title"
                      sx={{
                        color: 'text.primary',
                        fontSize: { xs: 'subtitle1.fontSize', md: 'body2.fontSize' },
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      className="date"
                      sx={{
                        color: 'text.secondary',
                        fontSize: {
                          xs: 'caption.fontSize',
                          sm: 'caption.fontSize',
                          md: 'body1.fontSize',
                        },
                      }}
                    >
                      {date}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      color: amountColor,
                      fontSize: {
                        xs: 'caption.fontSize',
                        sm: 'button.fontSize',
                        md: 'body1.fontSize',
                      },
                    }}
                  >
                    {type === 'credit' ? '+' : '-'} {currencyFormat(amount)}
                  </Typography>
                </Stack>
              </ListItem>
            ),
          )}
          {!transactions.length && (
            <ListItem sx={{ color: 'text.secondary' }}>No recent transactions.</ListItem>
          )}
        </List>
      </Card>
    </CardContainer>
  );
};

export default RecentTransactions;
