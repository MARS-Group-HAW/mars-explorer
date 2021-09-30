import { ChartData } from "chart.js";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useBoolean } from "react-use";
import {
  isCheckedByName,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectResultData } from "../../../QuickStartBar/utils/simulation-slice";
import getColorByIndex from "../../utils/colors";

type State = {
  data: ChartData;
  tick: number;
  maxTick: number;
  onTickChange: (value: number) => void;
  incrementTick: () => void;
  decrementTick: () => void;
};

function useBubbleChart(): State {
  const dataMap = useAppSelector(selectResultData);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();
  const [sliderTouched, setSliderTouched] = useBoolean(false);
  const [tick, setTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);

  useEffect(() => {
    const values = Object.values(dataMap);

    if (values.length === 0) return;

    const currentStep = _.findLastIndex(values[0].data);
    setMaxTick(currentStep);

    if (!sliderTouched) {
      setTick(currentStep);
    }
  }, [dataMap]);

  const decrementTick = () => setTick(Math.max(0, tick - 1));
  const incrementTick = () => setTick(Math.min(tick + 1, maxTick));

  const handleTickChange = (newTick: number) => {
    setSliderTouched(true);
    setTick(newTick);
  };

  return {
    tick,
    maxTick,
    onTickChange: handleTickChange,
    incrementTick,
    decrementTick,
    data: {
      datasets: Object.keys(dataMap).map((key, index) => ({
        label: `Coords of ${key} at tick ${tick}`,
        data: dataMap[key].data[tick].coords.map(({ x, y, count }) => ({
          x,
          y,
          count,
        })),
        hidden: !isCheckedByName(objectListWithMetaData, key),
        backgroundColor: getColorByIndex(index),
      })),
    },
  };
}

export default useBubbleChart;
