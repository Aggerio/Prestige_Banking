import { Stack, Typography } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import DataGridDecrementArrow from 'assets/decrement.svg';
import DataGriIncrementArrow from 'assets/increment.svg';
import Image from 'components/base/Image';

type ParamsProps = {
  params: GridCellParams;
};

const RenderCellDescription = ({ params }: ParamsProps) => {
  return (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ py: 1, width: 1, minWidth: 0 }}>
      {params.row.description.revenue === 'down' ? (
        <Image src={DataGriIncrementArrow} alt="expense" sx={{ width: 28, height: 28 }} />
      ) : (
        <Image src={DataGridDecrementArrow} alt="income" sx={{ width: 28, height: 28 }} />
      )}
      <Typography
        sx={{
          color: 'text.primary',
          fontFamily: 'Space Grotesk, Manrope, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {params.row.description.title}
      </Typography>
    </Stack>
  );
};

export default RenderCellDescription;
