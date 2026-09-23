import CardContainer from 'components/common/CardContainter';
import WeeklyActivityChart from 'components/sections/dashboard/activity/WeeklyActivityChart';
import type { TransactionDataType } from 'data/activity-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from 'providers/useEchartResize';
import { useRef } from 'react';
import { useDashboard } from 'providers/DashboardProvider';
import { Box, Typography } from '@mui/material';

const WeeklyActivity = () => {
  const chartRef = useRef<ReactECharts>(null);
  const { analytics } = useDashboard();
  const chartData: TransactionDataType =
    analytics?.weeklyActivity.map((point) => ({
      day: new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' }),
      deposit: point.deposits,
      withdraw: point.withdrawals,
    })) || [];
  const hasActivity = chartData.some((point) => point.deposit > 0 || point.withdraw > 0);
  useChartResize(chartRef);
  return (
    <CardContainer title="Weekly Activity">
      {hasActivity ? (
        <WeeklyActivityChart chartRef={chartRef} seriesData={chartData} />
      ) : (
        <Box
          sx={{
            minHeight: 270,
            display: 'grid',
            placeContent: 'center',
            textAlign: 'center',
            px: 3,
          }}
        >
          <Typography fontWeight={700}>No activity this week</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            This week&apos;s deposits and withdrawals will appear here when they are posted.
          </Typography>
        </Box>
      )}
    </CardContainer>
  );
};

export default WeeklyActivity;
