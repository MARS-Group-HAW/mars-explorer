import { useDeepCompareEffect } from "react-use";
import { useEffect, useState } from "react";
import {
  add,
  unselectAll,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import {
  selectResultKeys,
  selectSimulationHasStarted,
  selectSimulationStartingStatus,
} from "../../../QuickStartBar/utils/simulation-slice";
import ChartType from "../../utils/chart-type";

type State = {
  chartType: ChartType;
  handleChartTypeChange: (type: ChartType) => void;
  showEmptyMessage: boolean;
  showGridAndCharts: boolean;
  showChartSkeleton: boolean;
};

function useListChartGrid(): State {
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();
  const names = useAppSelector(selectResultKeys);
  const hasStarted = useAppSelector(selectSimulationHasStarted);
  const isStarting = useAppSelector(selectSimulationStartingStatus);
  const [chartType, setChartType] = useState(ChartType.LINE);

  useEffect(() => {
    dispatch(unselectAll);
  }, [isStarting]);

  useDeepCompareEffect(() => {
    names.forEach((name) => dispatch(add({ name })));
  }, [names]);

  const isEmpty = objectListWithMetaData.length === 0;

  return {
    showEmptyMessage: isEmpty && !hasStarted,
    showGridAndCharts: !isEmpty || hasStarted,
    showChartSkeleton: isStarting,
    chartType,
    handleChartTypeChange: setChartType,
  };
}

export default useListChartGrid;
