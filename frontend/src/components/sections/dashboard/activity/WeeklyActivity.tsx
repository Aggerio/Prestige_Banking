import CardContainer from 'components/common/CardContainter';
import WeeklyActivityChart from 'components/sections/dashboard/activity/WeeklyActivityChart';
import { TransactionDataType } from 'data/activity-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from 'providers/useEchartResize';
import { useRef } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const WeeklyActivity = () => {
  const chartRef = useRef<ReactECharts>(null);
  const { analytics } = useDashboard();
  const chartData: TransactionDataType =
    analytics?.weeklyActivity.map((point) => ({
      day: new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' }),
      deposit: point.deposits,
      withdraw: point.withdrawals,
    })) || [];
  useChartResize(chartRef);
  return (
    <CardContainer title="Weekly Activity">
      <WeeklyActivityChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default WeeklyActivity;
