import type { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';

export interface ChartDefaultDataType {
  [key: string]: any;
}

// pie chart
const pieChartDefaultOptions: ChartOptions | { cutout: number } = {
  maintainAspectRatio: true,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.label}: ${context.raw}%`,
      },
      enabled: false,
      position: 'nearest',
    },
  },
  cutout: 5,
  color: '#ffffff',
};
const pieChartDefaultData: ChartData = {
  labels: [],
  datasets: [
    {
      label: '# of Votes',
      data: [1, 1, 2, 1, 2, 2, 1, 2],
      backgroundColor: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#FDBA74', '#FB923C', '#F97316', '#EA580C'],
      borderColor: ['#FFFFFF'],
      borderWidth: 1,
    },
  ],
};

// area chart
const areaChartDefaultOptions: ChartOptions | { lineTension: number; bezierCurve: boolean; scales: any } = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  lineTension: 0.3,
  bezierCurve: true,
  scales: {
    x: {
      grid: {
        color: 'rgba(243, 244, 246, 0.34)',
        tickLength: 0,
      },
      ticks: {
        align: 'center',
        maxRotation: 0,
        autoSkip: true,
        sampleSize: 2,
        autoSkipPadding: 0,
        labelOffset: 35,
        font: {
          size: 12,
          family: 'Inter',
          weight: '400',
          lineHeight: '150%',
          color: '#64748B',
        },
        callback(value: string, index: number, values: any[]) {
          if (index > 0 && index < values.length - 1) return '';
          const time = (this as any).getLabelForValue(value);
          const timeLabel = moment(time).format('YYYY-MM-DD');
          if (index === 0) return `${timeLabel}`;
          if (index === values.length - 1) return `${timeLabel}         `;
          return ``;
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(243, 244, 246, 0.34)',
        tickLength: 10,
        tickColor: 'transparent',
      },
      ticks: {
        callback(value: string) {
          return `${value}`;
        },
        font: {
          size: 12,
          family: 'Inter',
          weight: '400',
          lineHeight: '150%',
          color: '#64748B',
        },
        max: '30',
      },
      title: {
        display: true,
        text: 'Assets Per Vault Share',
      },
    },
  },
};

const areaChartDefaultData: ChartData = {
  labels: [],
  datasets: [
    {
      fill: true,
      data: [],
      borderColor: '#FB923C',
      backgroundColor: '#FFF7F0',
      borderWidth: 2,
      pointRadius: 0,
    },
  ],
};

export const chartDefaultData: ChartDefaultDataType = {
  pie: {
    data: pieChartDefaultData,
    options: pieChartDefaultOptions,
  },
  area: {
    data: areaChartDefaultData,
    options: areaChartDefaultOptions,
  },
};
