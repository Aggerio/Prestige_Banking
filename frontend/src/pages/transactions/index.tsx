import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import QuickTransfer from 'components/sections/dashboard/transfer/QuickTransfer';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';
import { useState } from 'react';

const TransactionsPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <Stack sx={{ minHeight: 'calc(100vh - 180px)', py: { xs: 2.5, md: 3.5 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
        alignItems={{ sm: 'end' }}
      >
        <Stack gap={0.75}>
          <Typography sx={{ font: '10px DM Mono', letterSpacing: '.13em', color: 'primary.main' }}>
            MONEY MOVEMENT / RECORD
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', letterSpacing: '-.06em' }}>
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review account activity or create a new bank transfer.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<IconifyIcon icon="solar:add-circle-linear" />}
          onClick={() => setOpen(true)}
        >
          New transaction
        </Button>
      </Stack>
      <InvoiceOverviewTable />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <QuickTransfer />
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default TransactionsPage;
