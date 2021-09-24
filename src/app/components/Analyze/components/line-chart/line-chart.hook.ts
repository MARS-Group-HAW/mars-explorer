import _ from "lodash";
import { ChartData } from "chart.js";
import { useMemo } from "react";
import ResultData, { ResultDataPerObject } from "../../utils/ResultData";
import useDataSet from "../hooks/use-data-set";

type State = {
  data: ChartData;
};

function getYdata(data: ResultData): number[] {
  const groupedByStep = _.groupBy(data, (rawDatum) => rawDatum.Step);
  return Object.values(groupedByStep).map((arr) => arr.length);
}

function getXdata(data: ResultDataPerObject): number[] {
  const resultData = Object.values(data);
  const lastSteps = resultData.map((values) => _.last(values.data)?.Step);
  const maxSteps = _.max(lastSteps);
  return Array.from({ length: maxSteps }, (v, k) => k + 1);
}

function useLineChart(rawData: ResultDataPerObject): State {
  const keys = useMemo(() => Object.keys(rawData), [rawData]);
  const values = Object.values(rawData);
  useDataSet(rawData["Grass.csv"]);

  const isEmpty = !values.some((datum) => datum.data.length);

  const labels = isEmpty ? [1] : getXdata(rawData);

  const results = isEmpty
    ? []
    : keys
        // .filter((key) => !rawData[key].isLoading) // FIXME test if loading improves
        .filter((key) => rawData[key].data.length > 0)
        .map((key) => ({
          key,
          values: getYdata(rawData[key].data),
        }));

  return {
    data: {
      labels,
      datasets: results.map(({ key, values }) => ({
        label: `# of ${key}`,
        data: values,
      })),
    },
  };
}

export default useLineChart;
