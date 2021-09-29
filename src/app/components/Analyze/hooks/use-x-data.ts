import _ from "lodash";
import { useState } from "react";
import { useCustomCompareEffect } from "react-use";
import lengthReduce from "../utils/utils-fn";

type State = {
  xData: number[];
};

const isEqual = (prevDeps: unknown[][], nextDeps: unknown[][]) =>
  prevDeps.length === nextDeps.length &&
  lengthReduce(prevDeps) === lengthReduce(nextDeps);

function useXData(values: unknown[][]): State {
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
