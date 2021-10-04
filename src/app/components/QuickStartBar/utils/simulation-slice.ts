import localStorageService, {
  CacheKey,
} from "@app/utils/local-storage-service";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { SimulationStates } from "@shared/types/SimulationStates";
import {
  SimulationCountMessage,
  SimulationVisMessage,
} from "@shared/types/SimulationMessages";
import type { RootState } from "../../../utils/store";
import { ResultData, ResultDataWithMeta } from "../../Analyze/utils/ResultData";
import ResultsInStorage from "../../../utils/types/results-in-storage";

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

// Define the initial state using that type
const initialState: SimulationState = {
  simulationState: SimulationStates.NONE,
  resultData: [],
};

const findIndexOfResultDataByName = (
  state: SimulationState,
  name: string
): number => state.resultData.findIndex((results) => results.name === name);

const findIndexInResultByProgress = (
  state: SimulationState,
  index: number,
  progress: number
): number =>
  state.resultData[index].data.findIndex(
    (result) => result.progress === progress
  );

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
    addCountData: (state, action: PayloadAction<SimulationCountMessage>) => {
      const { progress, objectCounts } = action.payload;
      state.simulationState = SimulationStates.RUNNING;

      objectCounts.forEach(({ name, count }) => {
        let indexOfResults = findIndexOfResultDataByName(state, name);

        if (indexOfResults === -1) {
          indexOfResults =
            state.resultData.push({
              name,
              ...initialResultDataWithMeta,
            }) - 1;
        }

        const indexOfObjWithProgress = findIndexInResultByProgress(
          state,
          indexOfResults,
          progress
        );

        if (indexOfObjWithProgress === -1) {
          state.resultData[indexOfResults].data.push({
            progress,
            count,
          });
        } else {
          state.resultData[indexOfResults].data[indexOfObjWithProgress].count =
            count;
        }
        state.resultData[indexOfResults].isLoading = true;
        state.resultData[indexOfResults].hasCompleted = false;
      });
    },
    addPosData: (state, action: PayloadAction<SimulationVisMessage>) => {
      const { progress, objectCoords } = action.payload;
      const { name, coords } = objectCoords;

      state.simulationState = SimulationStates.RUNNING;

      let indexOfResults = findIndexOfResultDataByName(state, name);

      if (indexOfResults === -1) {
        indexOfResults =
          state.resultData.push({
            name,
            ...initialResultDataWithMeta,
          }) - 1;
      }

      const indexOfObjWithProgress = findIndexInResultByProgress(
        state,
        indexOfResults,
        progress
      );

      if (indexOfObjWithProgress === -1) {
        state.resultData[indexOfResults].data.push({
          progress,
          coords,
        });
      } else {
        state.resultData[indexOfResults].data[indexOfObjWithProgress].coords =
          coords;
      }
      state.resultData[indexOfResults].isLoading = true;
      state.resultData[indexOfResults].hasCompleted = false;
    },
    finishResults: (state) => {
      console.log(current(state).resultData);
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
    },
    saveDataToLocalStorage: (state, action: PayloadAction<string>) => {
      console.log(current(state).resultData);
      window.api.logger.info("Saving results");
      const resultsInStorage: ResultsInStorage = {
        projectPath: action.payload,
        results: current(state).resultData,
      };

      localStorageService.setItem(CacheKey.RESULTS_BY_KEY, resultsInStorage);
    },
    restoreDataFromLocalStorage: (state, action: PayloadAction<string>) => {
      const restoredData = localStorageService.getItem(CacheKey.RESULTS_BY_KEY);

      if (!restoredData) {
        window.api.logger.info("No result data for this project found.");
        return;
      }

      if (restoredData && restoredData.projectPath !== action.payload) {
        window.api.logger.info(
          "Overwriting result data of ",
          restoredData.projectPath
        );
        localStorageService.removeItem(CacheKey.RESULTS_BY_KEY);
        return;
      }

      const restoredDataWithFlag = restoredData.results.map((result) => ({
        ...result,
        hasBeenRestored: true,
      }));

      window.api.logger.info("Successfully restored old results.");

      state.resultData = restoredDataWithFlag;
    },
  },
});

export const {
  setSimulationState,
  addCountData,
  addPosData,
  finishResults,
  restoreDataFromLocalStorage,
  saveDataToLocalStorage,
} = simulationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSimulationState = (state: RootState) =>
  state.simulation.simulationState;
export const selectSimulationHasStarted = (state: RootState) =>
  state.simulation.simulationState !== SimulationStates.NONE;
export const selectSimulationStartingStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.STARTED;
export const selectSimulationRunningStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.RUNNING;
export const selectSimulationFinishedStatus = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.SUCCESS;
export const selectResultKeys = (state: RootState) =>
  state.simulation.resultData.map((data) => data.name);
export const selectResultData = (state: RootState) =>
  state.simulation.resultData;

export default simulationSlice.reducer;
