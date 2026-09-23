import { Box, Card, Stack, Typography } from '@mui/material';
import BankLogoAlt from 'assets/bank-logo-alt.svg';
import BankLogo from 'assets/bank-logo.svg';
import Image from 'components/base/Image';
import IconifyIcon from 'components/base/IconifyIcon';
import { currencyFormat } from 'helpers/utils';
import { ReactNode } from 'react';

export interface CreditCardData {
  balance: string;
  cardHolder: string;
  validThru: string;
  cardNumber: string;
  cardType?: string;
  status?: string;
  theme?: 'blue' | 'white';
}

interface CreditCardProps {
  theme?: 'blue' | 'white';
  cardData: CreditCardData;
  actions?: ReactNode;
}

const CreditCard = ({ theme = 'white', cardData, actions }: CreditCardProps) => {
  const dark = theme === 'blue';
  const {
    balance,
    cardHolder,
    validThru,
    cardNumber,
    cardType = 'DEBIT',
    status = 'ACTIVE',
  } = cardData;
  const textColor = dark ? '#F7FFFB' : '#10201A';
  const mutedColor = dark ? 'rgba(231,248,240,.65)' : 'rgba(24,50,40,.58)';

  return (
    <Card
      sx={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        minHeight: { xs: 280, sm: 305 },
        overflow: 'hidden',
        background: dark
          ? 'linear-gradient(135deg,#102B27 0%,#173E37 52%,#0A1715 100%)'
          : 'linear-gradient(145deg,#FFFFFF 0%,#EAF3EF 100%)',
        color: textColor,
        border: 0,
        outline: 0,
        borderRadius: 3,
        boxShadow: dark ? '0 24px 50px rgba(5,20,16,.28)' : '0 20px 45px rgba(24,57,44,.14)',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          right: -80,
          top: -95,
          background: dark ? 'rgba(86,200,156,.24)' : 'rgba(84,181,143,.2)',
          filter: 'blur(2px)',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(110deg,transparent 15%,rgba(255,255,255,.16) 37%,transparent 58%)',
          transform: 'translateX(-120%)',
          transition: 'transform .8s ease',
          pointerEvents: 'none',
        },
        '&:hover::after': { transform: 'translateX(120%)' },
        '@media (prefers-reduced-motion: reduce)': { '&::after': { display: 'none' } },
      }}
    >
      <Stack
        sx={{
          minHeight: { xs: 280, sm: 305 },
          justifyContent: 'space-between',
          p: { xs: 3, sm: 3.75, lg: 4 },
          gap: 3,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={{ font: '600 10px DM Mono', letterSpacing: '.16em', color: '#FFFFFF' }}>
              PRESTIGE BANKING
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 12, fontWeight: 700 }}>{cardType}</Typography>
          </Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: status === 'ACTIVE' ? '#73E2B3' : '#FFB49F',
                boxShadow: status === 'ACTIVE' ? '0 0 12px #73E2B3' : 'none',
              }}
            />
            <Typography sx={{ font: '600 9px DM Mono', letterSpacing: '.12em' }}>
              {status === 'BLOCKED' ? 'LOCKED' : status}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box
            sx={{
              width: 47,
              height: 35,
              borderRadius: 1,
              background: 'linear-gradient(135deg,#E7C778,#A98232)',
              border: '1px solid rgba(55,41,10,.25)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: '7px 0',
                borderTop: '1px solid rgba(55,41,10,.35)',
                borderBottom: '1px solid rgba(55,41,10,.35)',
              },
            }}
          />
          <IconifyIcon
            icon="solar:wi-fi-router-minimalistic-bold"
            width={25}
            sx={{ transform: 'rotate(90deg)', opacity: 0.72 }}
          />
        </Stack>

        <Box>
          <Typography
            sx={{
              fontFamily: 'DM Mono, monospace',
              fontSize: { xs: 17, sm: 21, lg: 23 },
              letterSpacing: { xs: '.065em', sm: '.09em' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'clip',
            }}
          >
            {cardNumber}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            gap={2}
            mt={2.5}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{ color: mutedColor, font: '500 9px DM Mono', letterSpacing: '.12em' }}
              >
                CARD HOLDER
              </Typography>
              <Typography
                noWrap
                sx={{ mt: 0.4, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}
              >
                {cardHolder}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography
                sx={{ color: mutedColor, font: '500 9px DM Mono', letterSpacing: '.12em' }}
              >
                VALID THRU
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 13, fontWeight: 700 }}>{validThru}</Typography>
            </Box>
            <Image
              src={dark ? BankLogo : BankLogoAlt}
              alt="card network"
              sx={{ width: 42, flexShrink: 0 }}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
            gap={2}
            mt={1.5}
          >
            <Typography sx={{ color: mutedColor, fontSize: 10 }}>
              Available {currencyFormat(Number(balance))}
            </Typography>
            {actions && (
              <Stack direction="row" gap={1} onClick={(event) => event.stopPropagation()}>
                {actions}
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default CreditCard;
