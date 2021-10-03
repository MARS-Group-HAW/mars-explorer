import { ChartData, LegendItem } from "chart.js";
import {
  isCheckedByName,
  toggle,
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
  onLabelClick: (legendItem: LegendItem) => void;
};

const xData = [...Array(101).keys()];

function useLineChart(): State {
  const dataMap = useAppSelector(selectResultData);
  const isRunning = useAppSelector(selectSimulationRunningStatus);
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();

  const onLabelClick = (legendItem: LegendItem) => {
    const index = legendItem.datasetIndex;
    const clickedObj = objectListWithMetaData[index];

    if (!clickedObj) {
      window.api.logger.warn("Clicked item not found.");
      return;
    }

    dispatch(toggle({ name: clickedObj.name }));
  };

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
    onLabelClick,
  };
}

export default useLineChart;
