import { useDeepCompareEffect } from "react-use";
import { useState } from "react";
import {
  add,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectResultKeys } from "../../../QuickStartBar/utils/simulation-slice";
import ChartType from "../../utils/chart-type";

type State = {
  chartType: ChartType;
  handleChartTypeChange: (type: ChartType) => void;
  showEmptyMessage: boolean;
  showGridAndCharts: boolean;
};

function useListChartGrid(): State {
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();
  const names = useAppSelector(selectResultKeys);
  const [chartType, setChartType] = useState(ChartType.LINE);

  useDeepCompareEffect(() => {
    names.forEach((name) => dispatch(add({ name })));
  }, [names]);

  const isEmpty = objectListWithMetaData.length === 0;

  return {
    showEmptyMessage: isEmpty,
    showGridAndCharts: !isEmpty,
    chartType,
    handleChartTypeChange: setChartType,
  };
}

export default useListChartGrid;
