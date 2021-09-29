import { useDeepCompareEffect } from "react-use";
import _ from "lodash";
import {
  add,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectResultKeys } from "../../../QuickStartBar/utils/simulation-slice";

type State = {
  showEmptyMessage: boolean;
  showGridAndCharts: boolean;
};

function useListChartGrid(): State {
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();

  const keys = useAppSelector(selectResultKeys);

  useDeepCompareEffect(() => {
    keys.forEach((key) => dispatch(add({ name: key })));
  }, [keys]);

  const isEmpty = objectListWithMetaData.length === 0;

  return {
    showEmptyMessage: isEmpty,
    showGridAndCharts: !isEmpty,
  };
}

export default useListChartGrid;
