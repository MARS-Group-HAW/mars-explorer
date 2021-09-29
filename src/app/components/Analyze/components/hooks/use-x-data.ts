import _ from "lodash";
import { useState } from "react";
import { useCustomCompareEffect } from "react-use";
import { SingleDataState } from "./data-set-reducer";
import lengthReduce from "../../utils/utils-fn";

type SingleDataStateData = SingleDataState["data"];

type State = {
  xData: number[];
};

const isEqual = (
  prevDeps: SingleDataStateData[],
  nextDeps: SingleDataStateData[]
) =>
  prevDeps.length === nextDeps.length &&
  lengthReduce(prevDeps) === lengthReduce(nextDeps);

function useXData(values: SingleDataStateData[]): State {
  const [xData, setXData] = useState([]);

  useCustomCompareEffect(
    () => {
      const lengths = values.map((data) => data.length);
      const maxSteps = _.max(lengths) || 0;
      setXData(Array.from({ length: maxSteps }, (v, k) => k + 1));
    },
    [values],
    (prevDeps, nextDeps) => isEqual(prevDeps[0], nextDeps[0])
  );

  return {
    xData,
  };
}

export default useXData;
