import { SxProps, useTheme } from '@mui/material';
import ReactEchart from 'components/base/ReactEchart';
import { ExpenseDataType } from 'data/expense-chart';
import { BarSeriesOption, XAXisComponentOption, YAXisComponentOption } from 'echarts';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | TooltipComponentOption
  | GridComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
>;
echarts.use([BarChart, CanvasRenderer, GridComponent, TooltipComponent]);

interface ExpenseStatisticsChartProps {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  sx?: SxProps;
  seriesData: ExpenseDataType;
}
const ExpenseStatisticsChart = ({ chartRef, ...rest }: ExpenseStatisticsChartProps) => {
  const { seriesData } = rest;
  const theme = useTheme();
  const { palette } = theme;
  const chartOptions: ECOption = useMemo(() => {
    return {
      backgroundColor: palette.common.white,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (value) => {
          const amount = Array.isArray(value) ? value[0] : value;
          return `₹ ${Number(amount).toLocaleString('en-IN')}`;
        },
      },
      grid: { top: 8, right: 64, bottom: 8, left: 72, containLabel: false },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: palette.text.secondary,
          formatter: (value: number) => `₹${value >= 1000 ? `${value / 1000}k` : value}`,
        },
        splitLine: { lineStyle: { color: palette.divider, type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: seriesData.map((item) => item.name),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: palette.text.secondary, fontWeight: 600 },
      },
      series: [
        {
          name: 'Monthly expense',
          type: 'bar',
          data: seriesData.map((item) => item.value),
          barMaxWidth: 15,
          itemStyle: {
            color: palette.primary.main,
            borderRadius: [0, 6, 6, 0],
          },
          label: {
            show: true,
            position: 'right',
            formatter: '₹ {c}',
            color: palette.text.primary,
            fontSize: 12,
            fontWeight: 'bold',
          },
          animationEasing: 'cubicOut',
          animationDuration: 1000,
        },
      ],
    };
  }, [theme, seriesData]);

  return (
    <ReactEchart
      echarts={echarts}
      option={chartOptions}
      ref={chartRef}
      sx={{
        width: 1,
        height: 1,
        maxHeight: 270,
        minWidth: 1,
      }}
      {...rest}
    />
  );
};

export default ExpenseStatisticsChart;
