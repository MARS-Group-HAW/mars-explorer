import * as React from "react";
import { Line } from "react-chartjs-2";
import useLineChart from "./line-chart.hook";
import { ResultDataPerObject } from "../../utils/ResultData";

type Props = {
  rawData: ResultDataPerObject;
};

function LineChart({ rawData }: Props) {
  const { data } = useLineChart(rawData);

  return <Line data={data} />;
}

export default LineChart;
