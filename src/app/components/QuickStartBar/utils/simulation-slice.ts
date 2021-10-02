import localStorageService, {
  CacheKey,
} from "@app/utils/local-storage-service";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { SimulationStates } from "@shared/types/SimulationStates";
import type { RootState } from "../../../utils/store";
import {
  ResultData,
  ResultDataWithMeta,
  ResultDatum,
} from "../../Analyze/utils/ResultData";

// Define a type for the slice state
type SimulationState = {
  simulationState: SimulationStates;
  resultData: ResultData;
};

const initialResultDataWithMeta: Omit<ResultDataWithMeta, "name"> = {
  data: [],
  isLoading: false,
  hasBeenRestored: false,
  hasCompleted: false,
};

function restoreResults(): ResultData {
  const restoredData = localStorageService.getItem(CacheKey.RESULTS_BY_KEY);

  if (!restoredData) {
    window.api.logger.info("Could not restore old result data.");
    return [];
  }

  restoredData.forEach((result) => {
    result.hasBeenRestored = true;
  });

  window.api.logger.info("Successfully restored old results.");

  return restoredData;
}

// Define the initial state using that type
const initialState: SimulationState = {
  simulationState: SimulationStates.NONE,
  resultData: restoreResults(),
};

const findIndexOfResultDataByName = (
  state: SimulationState,
  name: string
): number => state.resultData.findIndex((results) => results.name === name);

export const simulationSlice = createSlice({
  name: "simulation",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSimulationState: (state, action: PayloadAction<SimulationStates>) => {
      state.simulationState = action.payload;

      if (action.payload === SimulationStates.STARTED) {
        state.resultData = state.resultData.map(({ name }) => ({
          name,
          ...initialResultDataWithMeta,
        }));
      }
    },
    addResults: (
      state,
      action: PayloadAction<{ name: string; data: ResultDatum }>
    ) => {
      const { name, data } = action.payload;
      state.simulationState = SimulationStates.RUNNING;

      const indexOfResults = findIndexOfResultDataByName(state, name);

      if (indexOfResults === -1) {
        state.resultData.push({
          name,
          isLoading: true,
          hasCompleted: false,
          hasBeenRestored: false,
          data: [data],
        });
      } else {
        state.resultData[indexOfResults].isLoading = true;
        state.resultData[indexOfResults].hasCompleted = false;
        state.resultData[indexOfResults].data.push(data);
      }
    },
    finishResults: (state) => {
      console.log("IN FINISH RESULTS");
      state.simulationState = SimulationStates.SUCCESS;
      state.resultData.forEach(({ name }) => {
        const indexOfResults = findIndexOfResultDataByName(state, name);

        if (indexOfResults === -1) {
          window.api.logger.warn(
            `Tried to finalize results of ${name} but it has not even been initialized yet.`
          );
          return;
        }

        state.resultData[indexOfResults].isLoading = false;
        state.resultData[indexOfResults].hasCompleted = true;
      });

      localStorageService.setItem(
        CacheKey.RESULTS_BY_KEY,
        current(state.resultData)
      );
    },
  },
});

export const { setSimulationState, addResults, finishResults } =
  simulationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSimulationState = (state: RootState) =>
  state.simulation.simulationState;
export const selectSimulationRunningStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.RUNNING;
export const selectSimulationFinishedStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.SUCCESS;
export const selectResultKeys = (state: RootState) =>
  state.simulation.resultData.map((data) => data.name);
export const selectResultData = (state: RootState) =>
  state.simulation.resultData;

export default simulationSlice.reducer;
