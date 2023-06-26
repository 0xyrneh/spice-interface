import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import moment from "moment";
import { ChartValue } from "@/types/vault";
import { PeriodFilter } from "@/types/common";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const getOptions = (
  data: ChartValue[],
  period: PeriodFilter,
  yPrefix?: string
) => ({
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
    },
  },
  scales: {
    x: {
      type: "time",
      grid: {
        color: "rgba(161, 161, 161, 0.3)",
        drawTicks: false,
      },
      time: {
        unit:
          period === PeriodFilter.Day
            ? "hour"
            : period === PeriodFilter.Year || period === PeriodFilter.All
            ? "day"
            : "day",
        displayFormats: {
          hour: "hh:mm a",
          day: "MM/DD/YYYY",
          month: "MM/DD/YYYY",
        },
      },
      adapters: {
        date: {
          locale: moment,
        },
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
        minTicksLimit: 7,
        padding: 10,
        callback: function (value: any, index: number, ticks: any) {
          if (
            index === 0 &&
            data.length > 0 &&
            value === moment(data[0].x).unix() * 1000
          ) {
            return "";
          }
          if (
            index === ticks.length - 1 &&
            data.length > 0 &&
            value === moment(data[data.length - 1].x).unix() * 1000
          ) {
            return "";
          }
          return moment(value).format(
            period === PeriodFilter.Day ? "hh:mm a" : "MM/DD/YYYY"
          );
        },
      },
    },
    y: {
      grid: {
        color: "rgba(161, 161, 161, 0.3)",
        drawTicks: false,
      },
      ticks: {
        callback: function (value: any) {
          return (yPrefix ?? "") + Number(value).toFixed(2);
        },
        padding: 10,
      },
    },
  },
  pointRadius: 1,
  hoverRadius: 2,
});

const getChartData = (data: ChartValue[]) => ({
  labels: data.map((item) => item.x),
  datasets: [
    {
      data: data.map((item) => item.y),
      borderColor: "#FFE3CA",
      backgroundColor: "#FFE3CA",
    },
  ],
});

type Props = {
  data: ChartValue[];
  period: PeriodFilter;
  yPrefix?: string;
};

export default function LineChart({ data, period, yPrefix }: Props) {
  const [chartData, setChartData] = useState(getChartData(data));
  const [options, setOptions] = useState(getOptions(data, period, yPrefix));

  useEffect(() => {
    setChartData(getChartData(data));
  }, [data]);

  useEffect(() => {
    setOptions(getOptions(data, period, yPrefix));
  }, [yPrefix, period]);

  return <Line options={options as any} data={chartData} />;
}
