import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PieItem } from "@/types/common";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 5,
};

const propsToData = (props: PieItem[]) => {
  return {
    labels: props.map((item) => item.name),
    datasets: [
      {
        data: props.map((item) => item.value),
        backgroundColor: props.map((item) => item.color),
        borderColor: props.map(() => "#A1A1A1"),
        borderWidth: 1,
      },
    ],
  };
};

type Props = {
  data: PieItem[];
};

export default function PieChart({ data }: Props) {
  return <Doughnut options={options} data={propsToData(data)} />;
}
