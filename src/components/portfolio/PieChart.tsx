import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { PieItem } from "@/types/common";

ChartJS.register(ArcElement, Tooltip, Legend);

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: any) => b.lines);

    const tableBody = document.createElement("div");
    tableBody.style.display = "flex";
    tableBody.style.alignItems = "center";

    bodyLines.forEach((body: string, i: number) => {
      const colors = tooltip.labelColors[i];

      const box = document.createElement("span");
      box.style.background = colors.backgroundColor;
      box.style.marginRight = "4px";
      box.style.borderRadius = "4px";
      box.style.height = "14px";
      box.style.width = "14px";
      box.style.minHeight = "14px";
      box.style.minWidth = "14px";

      const title = document.createElement("span");
      title.appendChild(document.createTextNode(titleLines[i]));
      title.style.marginRight = "16px";
      title.style.maxHeight = "2.2rem";
      title.style.overflow = "hidden";

      const text = document.createTextNode(body + "%");

      tableBody.appendChild(box);
      tableBody.appendChild(title);
      tableBody.appendChild(text);
    });

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = "8px";
  tooltipEl.style.borderRadius = "4px";
  tooltipEl.style.border = "1px solid rgba(161, 161, 161, 0.3)";
  tooltipEl.style.background = "background: rgba(30, 30, 30, 0.95)";
  tooltipEl.style.fontSize = "12px";
  tooltipEl.style.fontWeight = "500";
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      external: externalTooltipHandler,
    },
  },
  cutout: 5,
};

const propsToData = (props: PieItem[]) => {
  return {
    labels: props.map((item) => item.name),
    datasets: [
      {
        data: props.map((item) => Number(item.value).toFixed(2)),
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
