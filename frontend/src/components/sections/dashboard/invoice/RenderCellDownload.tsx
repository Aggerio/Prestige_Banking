import { Button } from '@mui/material';
import { GridCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { useBreakpoints } from 'providers/useBreakpoints';

type ParamsProps = {
  params: GridCellParams;
};
const RenderCellDownload = ({ params }: ParamsProps) => {
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const handleDownloadRequest = (row: GridValidRowModel) => {
    const csv = `Transaction ID,Type,Date,Amount,Description\n${row.transactionId},${row.type},${row.date},${row.amount},"${row.description.title}"`;
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
      size={upLg ? 'medium' : 'small'}
      onClick={() => handleDownloadRequest(params.row)}
    >
      Download
    </Button>
  );
};

export default RenderCellDownload;
