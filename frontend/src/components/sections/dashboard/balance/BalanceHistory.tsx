import CardContainer from 'components/common/CardContainter';
import BalanceHistoryChart from 'components/sections/dashboard/balance/BalanceHistoryChart';
import { BalanceDataType } from 'data/balance-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from 'providers/useEchartResize';
import { useRef } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const BalanceHistory = () => {
  const chartRef = useRef<ReactECharts>(null);
  const { analytics } = useDashboard();
  const chartData: BalanceDataType =
    analytics?.balanceHistory.map((point) => ({
      month: point.month,
      value: point.closingBalance,
    })) || [];
  useChartResize(chartRef);
  return (
    <CardContainer title="Balance History">
      <BalanceHistoryChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default BalanceHistory;
