import * as React from "react";
import { Line } from "react-chartjs-2";
import useLineChart from "./line-chart.hook";

function LineChart() {
  const { data, onLabelClick } = useLineChart();

  return (
    <Line
      data={data}
      options={{
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Progress in %",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of entities",
            },
          },
        },
        plugins: {
          legend: {
            onClick: (e, legendItem) => onLabelClick(legendItem),
          },
        },
      }}
    />
  );
}

export default LineChart;
