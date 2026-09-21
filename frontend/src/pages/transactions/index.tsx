import { Stack } from '@mui/material';
import InvoiceOverviewTable from 'components/sections/dashboard/invoice/InvoiceOverviewTable';

const TransactionsPage = () => (
  <Stack sx={{ minHeight: 'calc(100vh - 180px)' }}>
    <InvoiceOverviewTable />
  </Stack>
);

export default TransactionsPage;
