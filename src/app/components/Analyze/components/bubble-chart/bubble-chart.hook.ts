import { ChartData, ChartOptions, LegendItem } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { useBoolean } from "react-use";
import {
  isCheckedByName,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import {
  selectProgress,
  selectResultData,
  selectWorldSizes,
} from "../../../QuickStartBar/utils/simulation-slice";
import getColorByIndex from "../../utils/colors";
import ResultDataPerTick from "../../utils/ResultData";
import useLabelClick from "../../hooks/use-label-click";

type State = {
  data: ChartData;
  options: ChartOptions;
  tick: number;
  maxTick: number;
  onTickChange: (value: number) => void;
  incrementTick: () => void;
  decrementTick: () => void;
  onLabelClick: (legendItem: LegendItem) => void;
};

function useBubbleChart(): State {
  const resultData = useAppSelector(selectResultData);
  const progress = useAppSelector(selectProgress);
  const worldSizes = useAppSelector(selectWorldSizes);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();
  const [sliderTouched, setSliderTouched] = useBoolean(false);
  const [tick, setTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);
  const { onLabelClick } = useLabelClick();

  useEffect(() => {
    if (resultData.length === 0 || !progress) return;

    setMaxTick(progress);

    if (!sliderTouched) {
      setTick(progress);
    }
  }, [progress]);

  const decrementTick = () => setTick(Math.max(0, tick - 1));
  const incrementTick = () => setTick(Math.min(tick + 1, maxTick));

  const handleTickChange = (newTick: number) => {
    setSliderTouched(true);
    setTick(newTick);
  };

  const getDataAtTick = (data: ResultDataPerTick) => {
    const dataAtTick = data.find((datum) => datum.progress === tick);

    if (!dataAtTick) return [];

    return dataAtTick.coords || [];
  };

  const worldSizesAreValid = useMemo(
    () =>
      worldSizes &&
      Object.values(worldSizes).every((val) => !Number.isNaN(val) && val >= 0),
    [worldSizes]
  );

  return {
    tick,
    maxTick,
    onTickChange: handleTickChange,
    incrementTick,
    decrementTick,
    data: {
      datasets: resultData.map(({ name, data }, index) => ({
        label: `Coords of ${name} at tick ${tick}`,
        data: getDataAtTick(data),
        hidden: !isCheckedByName(objectListWithMetaData, name),
        backgroundColor: getColorByIndex(index),
        animation: false,
      })),
    },
    options: worldSizesAreValid
      ? {
          scales: {
            x: {
              type: "linear",
              min: worldSizes.minX,
              max: worldSizes.maxX,
            },
            y: {
              type: "linear",
              min: worldSizes.minY,
              max: worldSizes.maxY,
            },
          },
        }
      : {},
    onLabelClick,
  };
}

export default useBubbleChart;
