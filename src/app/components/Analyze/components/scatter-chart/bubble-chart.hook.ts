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
  const resultData = useAppSelector(selectResultData);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();
  const [sliderTouched, setSliderTouched] = useBoolean(false);
  const [tick, setTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);

  useEffect(() => {
    if (resultData.length === 0) return;

    const ticksPerObject = resultData.map(
      (resultOfObject) => resultOfObject.data.length - 1
    );
    const commonMaxStep = _.min(ticksPerObject);
    const currentStep = Math.max(0, commonMaxStep);

    setMaxTick(currentStep);

    if (!sliderTouched) {
      setTick(currentStep);
    }
  }, [resultData]);

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
      datasets: resultData.map(({ name, data }, index) => ({
        label: `Coords of ${name} at tick ${tick}`,
        data: data[tick]
          ? data[tick].coords.map(({ x, y, count }) => ({
              x,
              y,
              count,
            }))
          : [],
        hidden: !isCheckedByName(objectListWithMetaData, name),
        backgroundColor: getColorByIndex(index),
      })),
    },
  };
}

export default useBubbleChart;
