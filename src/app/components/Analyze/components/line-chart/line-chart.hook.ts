import { ChartData } from "chart.js";
import {
  isCheckedByName,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectResultData } from "../../../QuickStartBar/utils/simulation-slice";
import getColorByIndex from "../../utils/colors";

type State = {
  data: ChartData;
};

const xData = [...Array(101).keys()];

function useLineChart(): State {
  const dataMap = useAppSelector(selectResultData);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();

  return {
    data: {
      labels: xData,
      datasets: Object.keys(dataMap).map((key, index) => ({
        label: `# of ${key}`,
        data: dataMap[key].data.map((datum) => datum.count),
        hidden: !isCheckedByName(objectListWithMetaData, key),
        backgroundColor: getColorByIndex(index),
      })),
    },
  };
}

export default useLineChart;
