import _ from "lodash";
import { useEffect, useReducer } from "react";
import { useUpdateEffect } from "react-use";
import ResultData, { ResultDataWithMeta } from "../../utils/ResultData";
import reducer, {
  addLastData,
  addLiveData,
  initialState,
} from "./data-set-reducer";

type State = {
  xData: number[];
  yData: number[];
};

function getYdata(data: ResultData): number[] {
  const groupedByStep = _.groupBy(data, (rawDatum) => rawDatum.Step);
  return Object.values(groupedByStep).map((arr) => arr.length);
}

function useDataSet(resultData: ResultDataWithMeta): State {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!resultData) return;

    dispatch(addLiveData(resultData.data));
    window.api.logger.info(state);
  }, [resultData]);

  // watch for loading changes
  useUpdateEffect(() => {
    console.log("loading changed to: ", resultData.isLoading); // will only show 1 and beyond
  }, [resultData?.isLoading]);

  return {
    xData: state.data,
    yData: resultData ? getYdata(resultData.data) : [],
  };
}

export default useDataSet;
