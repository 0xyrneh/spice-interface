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

const getOptions = (period: PeriodFilter, yPrefix?: string) => ({
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
        unit: period === PeriodFilter.Day ? "hour" : "day",
        displayFormats: {
          hour: "hh:mm a",
          day: "MM/DD/YYYY",
        },
      },
      adapters: {
        date: {
          locale: moment,
        },
      },
      ticks: {
        padding: 10,
      },
    },
    y: {
      grid: {
        color: "rgba(161, 161, 161, 0.3)",
        drawTicks: false,
      },
      ticks: {
        callback: function (value: any) {
          return (yPrefix ?? "") + value;
        },
        padding: 10,
      },
    },
  },
});

const getChartData = (data: ChartValue[]) => ({
  labels: data.map((item) => item.x),
  datasets: [
    {
      data: data.map((item) => item.y),
      borderColor: "#FFE3CA",
      backgroundColor: "#FFE3CA",
      tension: 0.4,
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
  const [options, setOptions] = useState(getOptions(period, yPrefix));

  useEffect(() => {
    setChartData(getChartData(data));
  }, [data]);

  useEffect(() => {
    setOptions(getOptions(period, yPrefix));
  }, [yPrefix, period]);

  return <Line options={options as any} data={chartData} />;
}
