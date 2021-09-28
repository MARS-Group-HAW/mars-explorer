import _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { useDeepCompareEffect, usePrevious } from "react-use";
import { ChartData } from "chart.js";
import reducer, {
  addLastData,
  addLiveData,
  initFile,
  initialState,
} from "./data-set-reducer";
import {
  selectAnalyzeData,
  selectCompletedData,
  selectKeys,
} from "../../utils/analyze-slice";
import { useAppSelector } from "../../../../utils/hooks/use-store";

type State = {
  data: ChartData;
};

function useDataSet(names: string[]): State {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dataByFileName = useAppSelector(selectAnalyzeData);
  const allFiles = useAppSelector(selectKeys);
  const completedFiles = useAppSelector(selectCompletedData);
  const alreadyCompletedFiles = usePrevious(completedFiles);
  const [xData, setXData] = useState([]);

  useEffect(() => {
    if (!dataByFileName) return;

    names
      .filter(
        (name) =>
          dataByFileName[name] &&
          !dataByFileName[name].hasCompleted &&
          dataByFileName[name].data
      )
      .forEach((name) => {
        dispatch(addLiveData({ name, data: dataByFileName[name].data }));
      });
  }, [dataByFileName]);

  useEffect(() => {
    const lengths = Object.values(state).map((data) => data.data.length);
    const maxSteps = _.max(lengths);
    setXData(Array.from({ length: maxSteps }, (v, k) => k + 1));
  }, [state]);

  useDeepCompareEffect(() => {
    const newlyCompleted = _.difference(completedFiles, alreadyCompletedFiles);
    newlyCompleted.forEach((name) => dispatch(addLastData({ name })));
  }, [completedFiles]);

  useDeepCompareEffect(
    () => allFiles.forEach((file) => dispatch(initFile({ name: file }))),
    [allFiles]
  );

  return {
    data: {
      labels: xData,
      datasets: Object.keys(state).map((key) => ({
        label: `# of ${key}`,
        data: state[key].data,
        hidden: !names.includes(key),
      })),
    },
  };
}

export default useDataSet;
