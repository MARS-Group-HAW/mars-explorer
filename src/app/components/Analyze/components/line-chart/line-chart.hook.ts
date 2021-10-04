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

  const yData = (indexOfDataSet: number) => {
    const newArr = new Array(101);
    dataMap[indexOfDataSet].data
      .filter((datum) => Number.isInteger(datum.count))
      .forEach((datum) => {
        newArr[datum.progress] = datum.count;
      });
    return newArr;
  };

  return {
    data: {
      labels: xData,
      datasets: dataMap.map(({ name }, indexOfDataset) => ({
        label: `# of ${name}`,
        data: yData(indexOfDataset),
        hidden: !isCheckedByName(objectListWithMetaData, name),
        backgroundColor: getColorByIndex(indexOfDataset),
        borderColor: getColorByIndex(indexOfDataset),
        animation: !isRunning,
      })),
    },
    onLabelClick,
  };
}

export default useLineChart;
