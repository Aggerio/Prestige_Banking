import { Button } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { GridCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { useBreakpoints } from 'providers/useBreakpoints';

type ParamsProps = {
  params: GridCellParams;
};
const RenderCellDownload = ({ params }: ParamsProps) => {
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const handleDownloadRequest = (row: GridValidRowModel) => {
    const csv = `Transaction ID,Type,Date,Amount (INR),Description\n${row.transactionId},${row.type},${row.date},${row.amount},"${row.description.title}"`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-${row.transactionId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => handleDownloadRequest(params.row)}
      startIcon={<IconifyIcon icon="solar:download-minimalistic-linear" />}
      sx={{
        borderColor: 'primary.light',
        color: 'primary.dark',
        fontFamily: 'Space Grotesk, Manrope, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        minWidth: upLg ? 84 : 34,
        px: upLg ? 1.25 : 0.75,
        '& .MuiButton-startIcon': { mr: upLg ? 0.5 : 0 },
      }}
    >
      {upLg ? 'Receipt' : ''}
    </Button>
  );
};

export default RenderCellDownload;
