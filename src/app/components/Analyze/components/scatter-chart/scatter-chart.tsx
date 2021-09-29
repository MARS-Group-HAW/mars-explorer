import * as React from "react";
import { Scatter } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { Slider } from "@material-ui/core";
import useScatterChart from "./line-chart.hook";

const options: ChartOptions = {
  plugins: {
    legend: {
      onClick: () => {}, // suppress for now
    },
  },
};

function ScatterChart() {
  const { data } = useScatterChart();

  return (
    <>
      <Scatter data={data} options={options} />
      <Slider
        defaultValue={30}
        valueLabelDisplay="auto"
        marks
        min={0}
        max={100}
        onChange={console.log}
      />
    </>
  );
}

export default ScatterChart;
