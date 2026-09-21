import CardContainer from 'components/common/CardContainter';
import ExpenseStatisticsChart from 'components/sections/dashboard/expense/ExpenseStatisticsChart';
import { ExpenseDataType } from 'data/expense-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from 'providers/useEchartResize';
import { useRef } from 'react';
import { useDashboard } from 'providers/DashboardProvider';

const ExpenseStatistics = () => {
  const chartRef = useRef<ReactECharts>(null);
  const { analytics } = useDashboard();
  const chartData: ExpenseDataType =
    analytics?.monthlyExpenses.map((point) => ({
      value: point.withdrawals,
      name: point.month,
      selected: false,
    })) || [];
  useChartResize(chartRef);
  return (
    <CardContainer title="Expense Statistics">
      <ExpenseStatisticsChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default ExpenseStatistics;
