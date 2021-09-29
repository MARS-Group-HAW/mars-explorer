import localStorageService, {
  CacheKey,
} from "@app/utils/local-storage-service";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { SimulationStates } from "@shared/types/SimulationStates";
import type { RootState } from "../../../utils/store";
import {
  ResultDataMap,
  ResultDataWithMeta,
  ResultDatum,
} from "../../Analyze/utils/ResultData";

// Define a type for the slice state
type SimulationState = {
  simulationState: SimulationStates;
  resultDataMap: ResultDataMap;
};

const initialResultDataWithMeta: ResultDataWithMeta = {
  data: [],
  isLoading: false,
  hasBeenRestored: false,
  hasCompleted: false,
};

function restoreResults(): ResultDataMap {
  const restoredData = localStorageService.getItem(CacheKey.RESULTS_BY_KEY);

  if (!restoredData) {
    window.api.logger.info("Could not restore old result data.");
    return {};
  }

  Object.values(restoredData).forEach((result) => {
    result.hasBeenRestored = true;
  });

  window.api.logger.info("Successfully restored old results.");

  return restoredData;
}

// Define the initial state using that type
const initialState: SimulationState = {
  simulationState: SimulationStates.NONE,
  resultDataMap: restoreResults(),
};

export const simulationSlice = createSlice({
  name: "simulation",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSimulationState: (state, action: PayloadAction<SimulationStates>) => {
      state.simulationState = action.payload;
    },
    initObject: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;

      if (!state.resultDataMap[name]) {
        state.resultDataMap[name] = initialResultDataWithMeta;
      }
    },
    addResults: (
      state,
      action: PayloadAction<{ name: string; data: ResultDatum }>
    ) => {
      const { name, data } = action.payload;
      state.simulationState = SimulationStates.RUNNING;
      state.resultDataMap[name].isLoading = true;
      state.resultDataMap[name].hasCompleted = false;
      state.resultDataMap[name].data.push(data);
    },
    finishResults: (state) => {
      Object.keys(state.resultDataMap).forEach((name) => {
        state.simulationState = SimulationStates.SUCCESS;
        state.resultDataMap[name].isLoading = false;
        state.resultDataMap[name].hasCompleted = true;
      });

      localStorageService.setItem(
        CacheKey.RESULTS_BY_KEY,
        current(state.resultDataMap)
      );
    },
  },
});

export const { setSimulationState, initObject, addResults, finishResults } =
  simulationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSimulationState = (state: RootState) =>
  state.simulation.simulationState;
export const selectSimulationRunningStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.RUNNING;
export const selectSimulationFinishedStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.SUCCESS;
export const selectResultKeys = (state: RootState) =>
  Object.keys(state.simulation.resultDataMap);
export const selectResultData = (state: RootState) =>
  state.simulation.resultDataMap;

export default simulationSlice.reducer;
