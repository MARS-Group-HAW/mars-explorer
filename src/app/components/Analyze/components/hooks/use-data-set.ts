import _ from "lodash";
import { useReducer, useRef } from "react";
import {
  useCustomCompareEffect,
  useDeepCompareEffect,
  usePrevious,
} from "react-use";
import { ChartData } from "chart.js";
import reducer, {
  addLastData,
  addLiveData,
  initFileIfNotExists,
  initialState,
} from "./data-set-reducer";
import {
  resetData,
  selectAnalyzeData,
  selectCompletedData,
  selectKeys,
} from "../../utils/analyze-slice";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import useXData from "./use-x-data";
import { ResultDataPerObject } from "../../utils/ResultData";
import lengthReduce from "../../utils/utils-fn";

type State = {
  data: ChartData;
};

const isEqual = (prev: ResultDataPerObject, next: ResultDataPerObject) => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) return false;

  const prevValues = Object.values(prev);
  const nextValues = Object.values(next);

  const prevDataLength = lengthReduce(
    prevValues.map((resultData) => resultData.data)
  );
  const nextDataLength = lengthReduce(
    nextValues.map((resultData) => resultData.data)
  );

  if (prevDataLength !== nextDataLength) return false;

  return true;
};

function useDataSet(names: string[]): State {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dataRef = useRef(state);
  dataRef.current = state;
  const dataByFileName = useAppSelector(selectAnalyzeData);
  const allFiles = useAppSelector(selectKeys);
  const completedFiles = useAppSelector(selectCompletedData);
  const alreadyCompletedFiles = usePrevious(completedFiles);
  const { xData } = useXData(Object.values(state).map((data) => data.data));

  useCustomCompareEffect(
    () => {
      if (!dataByFileName) return;

      // add new data
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

      // reset data
      names
        .filter(
          (name) =>
            dataByFileName[name] &&
            !dataByFileName[name].hasCompleted &&
            !dataByFileName[name].isLoading
        )
        .forEach((name) => {
          dispatch(resetData({ name }));
        });
    },
    [dataByFileName],
    (nextDeps, prevDeps) => isEqual(prevDeps[0], nextDeps[0])
  );

  useDeepCompareEffect(() => {
    const newlyCompleted = _.difference(completedFiles, alreadyCompletedFiles);
    newlyCompleted.forEach((name) => dispatch(addLastData({ name })));
  }, [completedFiles]);

  useDeepCompareEffect(
    () =>
      allFiles.forEach((file) => dispatch(initFileIfNotExists({ name: file }))),
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
