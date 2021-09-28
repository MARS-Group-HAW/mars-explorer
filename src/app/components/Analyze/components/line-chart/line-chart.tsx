import * as React from "react";
import { Line } from "react-chartjs-2";
import useLineChart from "./line-chart.hook";

type Props = {
  files: string[];
};

function LineChart({ files }: Props) {
  const { data } = useLineChart(files);

  return <Line data={data} />;
}

export default LineChart;
