import * as React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import useLineChart from "./line-chart.hook";

type Props = {
  files: string[];
};

const options: ChartOptions = {
  plugins: {
    legend: {
      onClick: () => {}, // suppress for now
    },
  },
};

function LineChart({ files }: Props) {
  const { data } = useLineChart(files);

  return <Line data={data} options={options} />;
}

export default React.memo(
  LineChart,
  (prevProps, nextProps) => prevProps.files.length === nextProps.files.length
);
