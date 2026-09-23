import { Alert, Box, Button, Card, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Alert, Box, Button, Card, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import CustomPagination from 'components/sections/dashboard/invoice/CustomPagination';
import NoData from 'components/sections/dashboard/invoice/NoData';
import RenderCellDescription from 'components/sections/dashboard/invoice/RenderCellDescription';
import RenderCellDownload from 'components/sections/dashboard/invoice/RenderCellDownload';
import IconifyIcon from 'components/base/IconifyIcon';
import type { RowData } from 'data/invoice-data';
import IconifyIcon from 'components/base/IconifyIcon';
import type { RowData } from 'data/invoice-data';
import { currencyFormat, dateFormatFromUTC } from 'helpers/utils';
import { getTransactions, Transaction } from 'api/banking';
import { apiError } from 'api/client';
import { apiError } from 'api/client';
import { useBreakpoints } from 'providers/useBreakpoints';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const columns: GridColDef[] = [
  {
    field: 'description',
    headerName: 'Description',
    width: 230,
    hideable: false,
    renderCell: (params) => <RenderCellDescription params={params} />,
    valueGetter: (params: GridValidRowModel) => params.title,
  },
  {
    field: 'transactionId',
    headerName: 'Reference',
    headerName: 'Reference',
    flex: 1,
    minWidth: 130,
    minWidth: 130,
    hideable: false,
    renderCell: (params) => (
      <Typography
        sx={{
          color: 'text.secondary',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        {String(params.value).length > 16
          ? `${String(params.value).slice(0, 7)}…${String(params.value).slice(-5)}`
          : params.value}
      </Typography>
    ),
    renderCell: (params) => (
      <Typography
        sx={{
          color: 'text.secondary',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        {String(params.value).length > 16
          ? `${String(params.value).slice(0, 7)}…${String(params.value).slice(-5)}`
          : params.value}
      </Typography>
    ),
  },
  {
    field: 'type',
    headerName: 'Direction',
    minWidth: 118,
    headerName: 'Direction',
    minWidth: 118,
    hideable: false,
    renderCell: (params) => {
      const incoming = params.value === 'DEPOSIT';
      return (
        <Chip
          label={incoming ? 'Incoming' : 'Outgoing'}
          size="small"
          sx={{
            height: 25,
            borderRadius: 1.5,
            bgcolor: incoming ? 'success.lighter' : 'error.lighter',
            color: incoming ? 'success.dark' : 'error.dark',
            fontFamily: 'Space Grotesk, Manrope, sans-serif',
            fontSize: 11,
            fontWeight: 700,
          }}
        />
      );
    },
    renderCell: (params) => {
      const incoming = params.value === 'DEPOSIT';
      return (
        <Chip
          label={incoming ? 'Incoming' : 'Outgoing'}
          size="small"
          sx={{
            height: 25,
            borderRadius: 1.5,
            bgcolor: incoming ? 'success.lighter' : 'error.lighter',
            color: incoming ? 'success.dark' : 'error.dark',
            fontFamily: 'Space Grotesk, Manrope, sans-serif',
            fontSize: 11,
            fontWeight: 700,
          }}
        />
      );
    },
  },
  {
    field: 'date',
    headerName: 'Posted',
    minWidth: 150,
    headerName: 'Posted',
    minWidth: 150,
    flex: 1,
    hideable: false,
    renderCell: (params) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
        {dateFormatFromUTC(params.value)}
      </Typography>
    ),
    renderCell: (params) => (
      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
        {dateFormatFromUTC(params.value)}
      </Typography>
    ),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    minWidth: 100,
    hideable: false,
    renderCell: (params) => {
      const color = params.row.description.revenue === 'down' ? 'error.main' : 'success.main';
      const symbol = params.row.description.revenue === 'down' ? '-' : '+';

      return (
        <Typography
          variant="body2"
          color={color}
          sx={{ fontFamily: 'Space Grotesk, Manrope, sans-serif', fontWeight: 700 }}
        >
        <Typography
          variant="body2"
          color={color}
          sx={{ fontFamily: 'Space Grotesk, Manrope, sans-serif', fontWeight: 700 }}
        >
          {symbol} {currencyFormat(params.value)}
        </Typography>
      );
    },
  },
  {
    field: 'download',
    headerName: 'Receipt',
    headerName: 'Receipt',
    sortable: false,
    minWidth: 92,
    minWidth: 92,
    renderCell: (params) => <RenderCellDownload params={params} />,
  },
];

const a11yProps = (index: number) => ({
  id: `transaction-tab-${index}`,
  'aria-controls': `transaction-tabpanel-${index}`,
});

let rowHeight = 60; // default row height

const InvoiceOverviewTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatingReceipts, setGeneratingReceipts] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [items, setItems] = useState<GridRowsProp<RowData>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [value, setValue] = useState(0);
  const { selectedAccount } = useDashboard();
  const { down } = useBreakpoints();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const isXs = down('sm');

  if (isXs) {
    rowHeight = 55;
  } else {
    rowHeight = 64;
  }

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const mapTransaction = (item: Transaction) => ({
    id: item.transactionId,
    description: {
      title: item.remarks || item.referenceNumber,
      revenue: item.movement === 'DEPOSIT' ? 'up' : 'down',
    },
    transactionId: item.referenceNumber,
    type: item.movement,
    card: 'Account',
    date: item.transactionAt,
    amount: item.amount,
  });

  const generateAllReceipts = async () => {
    if (!selectedAccount) return;
    setGeneratingReceipts(true);
    setReceiptError(null);
    try {
      const firstPage = await getTransactions(selectedAccount, { page: 0, size: 100 });
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(firstPage.data.totalPages - 1, 0) }, (_, page) =>
          getTransactions(selectedAccount, { page: page + 1, size: 100 }),
        ),
      );
      const transactions = [
        ...firstPage.data.items,
        ...remainingPages.flatMap((response) => response.data.items),
      ];
      const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const rows = transactions.map((item) =>
        [item.referenceNumber, item.movement, item.transactionAt, item.amount, item.remarks]
          .map(escape)
          .join(','),
      );
      const csv = ['Reference,Direction,Date,Amount (INR),Description', ...rows].join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `prestige-receipts-${selectedAccount}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setReceiptError(apiError(error));
    } finally {
      setGeneratingReceipts(false);
    }
  };

  const generateAllReceipts = async () => {
    if (!selectedAccount) return;
    setGeneratingReceipts(true);
    setReceiptError(null);
    try {
      const firstPage = await getTransactions(selectedAccount, { page: 0, size: 100 });
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(firstPage.data.totalPages - 1, 0) }, (_, page) =>
          getTransactions(selectedAccount, { page: page + 1, size: 100 }),
        ),
      );
      const transactions = [
        ...firstPage.data.items,
        ...remainingPages.flatMap((response) => response.data.items),
      ];
      const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const rows = transactions.map((item) =>
        [item.referenceNumber, item.movement, item.transactionAt, item.amount, item.remarks]
          .map(escape)
          .join(','),
      );
      const csv = ['Reference,Direction,Date,Amount (INR),Description', ...rows].join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `prestige-receipts-${selectedAccount}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setReceiptError(apiError(error));
    } finally {
      setGeneratingReceipts(false);
    }
  };

  useEffect(() => {
    if (!selectedAccount) {
      setItems([]);
      setTotalRows(0);
      return;
    }
    setLoading(true);
    setLoadError(null);
    const movement = value === 1 ? 'DEPOSIT' : value === 2 ? 'WITHDRAWAL' : undefined;
    void getTransactions(selectedAccount, {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      movement,
    })
      .then((response) => {
        setItems(response.data.items.map(mapTransaction));
        setTotalRows(response.data.totalElements);
      })
      .catch((error) => {
        setItems([]);
        setTotalRows(0);
        setLoadError(apiError(error));
      })
      .finally(() => setLoading(false));
  }, [selectedAccount, value, paginationModel]);

  return (
    <Stack sx={{ width: 1, minWidth: 0, overflow: 'hidden', justifyContent: 'space-between' }}>
      <Box
        sx={{
          mb: 1.25,
          mt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: 'text.primary',
              fontFamily: 'Space Grotesk, Manrope, sans-serif',
              fontSize: { xs: 'h6.fontSize', md: 'h5.fontSize' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Recent activity
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            Your latest incoming and outgoing transfers.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          disabled={!selectedAccount || generatingReceipts}
          onClick={() => void generateAllReceipts()}
          startIcon={<IconifyIcon icon="solar:document-download-linear" />}
        >
          {generatingReceipts ? 'Generating…' : 'Generate all receipts'}
        </Button>
          {generatingReceipts ? 'Generating…' : 'Generate all receipts'}
        </Button>
      </Box>
      {receiptError && (
        <Alert severity="error" onClose={() => setReceiptError(null)} sx={{ mb: 2 }}>
          {receiptError}
        </Alert>
      )}
      {loadError && (
        <Alert severity="error" onClose={() => setLoadError(null)} sx={{ mb: 2 }}>
          Unable to load transactions: {loadError}
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={value} onChange={handleChange} aria-label="transaction tabs">
          <Tab label="All Transactions" {...a11yProps(0)} />
          <Tab label="Income" {...a11yProps(1)} />
          <Tab label="Expense" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Card
        sx={{
          flexGrow: { md: 1 },
          width: 1,
          minWidth: 0,
          minHeight: 380,
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
          overflow: 'hidden',
          borderRadius: 3,
          borderRadius: 3,
          '&.MuiPaper-root': {
            p: { xs: 0, md: 1 },
            p: { xs: 0, md: 1 },
            border: 1,
            borderColor: 'primary.lighter',
            borderColor: 'primary.lighter',
            bgcolor: { xs: 'transparent', sm: 'white' },
            boxShadow: 'none',
            boxShadow: 'none',
          },
        }}
      >
        <DataGrid
          rowHeight={rowHeight}
          rows={items}
          rowCount={totalRows}
          columns={columns}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          slots={{
            noRowsOverlay: () => <NoData />,
            pagination: () => null, // Hide the default pagination component
          }}
          loading={loading}
          sx={{
            width: 1,
            minWidth: 0,
            minHeight: 360,
            border: 0,
            px: { xs: 0, md: 1 },
            '& .MuiDataGrid-main': {
              minHeight: 300,
            },
            '& .MuiDataGrid-virtualScroller': {
              minHeight: 300,
              p: 0,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'primary.lighter',
              borderBottom: 0,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'primary.lighter',
              borderBottom: 0,
            },
            '& .MuiDataGrid-columnHeader': {
              color: 'primary.dark',
              fontFamily: 'Space Grotesk, Manrope, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'primary.dark',
              fontFamily: 'Space Grotesk, Manrope, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            },
            '& .MuiDataGrid-cell': {
              borderBottomColor: 'primary.lighter',
              fontSize: 14,
              py: 0.5,
              borderBottomColor: 'primary.lighter',
              fontSize: 14,
              py: 0.5,
            },
            '& .MuiDataGrid-row': {
              transition: 'background-color 160ms ease',
              '&:hover': { bgcolor: 'primary.lighter' },
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            '& .MuiDataGrid-row': {
              transition: 'background-color 160ms ease',
              '&:hover': { bgcolor: 'primary.lighter' },
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
          }}
        />
      </Card>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
        <CustomPagination
          page={paginationModel.page + 1}
          pageCount={Math.max(1, Math.ceil(totalRows / paginationModel.pageSize))}
          onPageChange={(event, value) =>
            setPaginationModel((prev) => ({ ...prev, page: value - 1 }))
          }
        />
      </Box>
    </Stack>
  );
};

export default InvoiceOverviewTable;
