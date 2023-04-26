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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
      grid: {
        color: "rgba(161, 161, 161, 0.3)",
        drawTicks: false,
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
  "03/15/2023",
  "04/15/2023",
  "05/15/2023",
  "06/15/2023",
  "07/15/2023",
];

const data = {
  labels,
  datasets: [
    {
      label: "1W",
      data: [10, 50, 20, 50, 20],
      borderColor: "#FFE3CA",
      backgroundColor: "#FFE3CA",
      tension: 0.4,
    },
  ],
};

export default function PositionChart() {
  return <Line options={options} data={data} />;
}
