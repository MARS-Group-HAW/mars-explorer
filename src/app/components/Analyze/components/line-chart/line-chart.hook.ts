import { ChartData } from "chart.js";
import {
  isCheckedByName,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import {
  selectResultData,
  selectSimulationRunningStatus,
} from "../../../QuickStartBar/utils/simulation-slice";
import getColorByIndex from "../../utils/colors";

type State = {
  data: ChartData;
};

const xData = [...Array(101).keys()];

function useLineChart(): State {
  const dataMap = useAppSelector(selectResultData);
  const isRunning = useAppSelector(selectSimulationRunningStatus);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();

  return {
    data: {
      labels: xData,
      datasets: dataMap.map(({ name, data }, index) => ({
        label: `# of ${name}`,
        data: data.map((datum) => datum.count),
        hidden: !isCheckedByName(objectListWithMetaData, name),
        backgroundColor: getColorByIndex(index),
        borderColor: getColorByIndex(index),
        animation: !isRunning,
      })),
    },
  };
}

export default useLineChart;
