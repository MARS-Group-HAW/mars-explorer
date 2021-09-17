import _ from "lodash";
import { ChartData } from "chart.js";
import ResultData, { ResultDataPerObject } from "../../utils/ResultData";

type State = {
  data: ChartData;
};

function getSingleResultData(data: ResultData): number[] {
  const groupedByStep = _.groupBy(data, (rawDatum) => rawDatum.Step);
  return Object.values(groupedByStep).map((arr) => arr.length);
}

function getLabels(data: ResultDataPerObject): number[] {
  const resultData = Object.values(data);
  const finishedResultDatum = resultData.find(
    (datum) => !datum.isLoading && datum.data?.length
  );

  let maxSteps: number;

  if (finishedResultDatum) {
    maxSteps =
      finishedResultDatum.data[finishedResultDatum.data.length - 1].Step;
  } else {
    maxSteps = resultData.reduce(
      (previousIndex, currentValue, currentIndex, array) =>
        array[previousIndex].data.length > currentValue.data.length
          ? previousIndex
          : currentIndex,
      0
    );
  }

  return Array.from({ length: maxSteps }, (v, k) => k + 1);
}

function useLineChart(rawData: ResultDataPerObject): State {
  const keys = Object.keys(rawData);
  const values = Object.values(rawData);

  const isEmpty = !values.some((datum) => datum.data.length);

  const labels = isEmpty ? [] : getLabels(rawData);

  const results = isEmpty
    ? []
    : keys
        .filter((key) => rawData[key].data.length > 0)
        .map((key) => ({
          key,
          values: getSingleResultData(rawData[key].data),
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
