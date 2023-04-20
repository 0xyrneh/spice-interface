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
      position: "right" as const,
    },
    title: {
      display: true,
    },
  },
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
    },
  ],
};

export default function PositionChart() {
  return <Line options={options} data={data} />;
}
