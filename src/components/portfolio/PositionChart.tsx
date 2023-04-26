import React from "react";
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

const options = {
  responsive: true,
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
        displayFormats: {
          day: "MM/DD/YYYY",
          month: "MM/DD/YYYY",
        },
      },
      adapters: {
        date: {
          locale: moment,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(161, 161, 161, 0.3)",
        drawTicks: false,
      },
    },
  },
  maintainAspectRatio: false,
};

const labels = [
  "2023-3-15",
  "2023-4-15",
  "2023-5-15",
  "2023-6-15",
  "2023-7-15",
];

const data = {
  labels,
  datasets: [
    {
      label: "1W",
      data: [10, 50, 20, 50, 20],
      // [
      //   {
      //     x: 10,
      //     y: "2023-3-15",
      //   },
      //   {
      //     x: 50,
      //     y: "2023-4-15",
      //   },
      //   {
      //     x: 20,
      //     y: "2023-5-15",
      //   },
      //   {
      //     x: 50,
      //     y: "2023-6-15",
      //   },
      //   {
      //     x: 20,
      //     y: "2023-7-15",
      //   },
      // ],
      borderColor: "#FFE3CA",
      backgroundColor: "#FFE3CA",
      tension: 0.4,
    },
  ],
};

export default function PositionChart() {
  return <Line options={options} data={data} />;
}
