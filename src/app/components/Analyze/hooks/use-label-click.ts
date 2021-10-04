import { LegendItem } from "chart.js";
import {
  toggle,
  useSharedObjectsWithStatus,
} from "./use-objects-selection-context";

type State = {
  onLabelClick: (legendItem: LegendItem) => void;
};

function useLabelClick(): State {
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
    onLabelClick,
  };
}

export default useLabelClick;
