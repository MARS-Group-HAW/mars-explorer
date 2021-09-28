import { ChartData } from "chart.js";
import useDataSet from "../hooks/use-data-set";

type State = {
  data: ChartData;
};

function useLineChart(files: string[]): State {
  const { data } = useDataSet(files);

  return {
    data,
  };
}

export default useLineChart;
