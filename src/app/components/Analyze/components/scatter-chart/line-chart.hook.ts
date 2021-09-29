import { ChartData } from "chart.js";
import _ from "lodash";
import { useState } from "react";
import {
  isCheckedByName,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectResultData } from "../../../QuickStartBar/utils/simulation-slice";

type State = {
  data: ChartData;
  tick: number;
  maxTick: number;
  onTickChange: (value: number) => void;
};

function useScatterChart(): State {
  const dataMap = useAppSelector(selectResultData);
  const [objectListWithMetaData] = useSharedObjectsWithStatus();
  const [tick, setTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);

  return {
    tick,
    maxTick,
    onTickChange: setTick,
    data: {
      datasets: Object.keys(dataMap).map((key) => {
        const lastTick = tick || _.findLastIndex(dataMap[key].data);

        return {
          label: `Coords of ${key} at tick ${tick}`,
          data: _.last(dataMap[key].data).coords.map((cordTupel) => ({
            x: cordTupel[0],
            y: cordTupel[1],
          })),
          hidden: !isCheckedByName(objectListWithMetaData, key),
        };
      }),
    },
  };
}

export default useScatterChart;
