import * as React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import useLineChart from "./line-chart.hook";

const options: ChartOptions = {
  plugins: {
    legend: {
      onClick: () => {}, // suppress for now
    },
  },
};

function LineChart() {
  const { data } = useLineChart();

  return <Line data={data} options={options} />;
}

export default LineChart;
