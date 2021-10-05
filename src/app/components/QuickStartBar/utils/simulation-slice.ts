import localStorageService, {
  CacheKey,
} from "@app/utils/local-storage-service";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { SimulationStates } from "@shared/types/SimulationStates";
import {
  SimulationCountMessage,
  SimulationVisMessage,
} from "@shared/types/SimulationMessages";
import _ from "lodash";
import type { RootState } from "../../../utils/store";
import { ResultData, ResultDataWithMeta } from "../../Analyze/utils/ResultData";
import ResultsInStorage from "../../../utils/types/results-in-storage";

// Define a type for the slice state
type SimulationState = {
  simulationState: SimulationStates;
  maxProgress?: number;
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
        state.maxProgress = 0;
      }
    },
    addCountData: (state, action: PayloadAction<SimulationCountMessage>) => {
      const { progress, objectCounts } = action.payload;

      objectCounts.forEach(({ name, count }) => {
        const indexOfResults = findIndexOfResultDataByName(state, name);

        if (indexOfResults === -1) {
          state.resultData.push({
            name,
            ...initialResultDataWithMeta,
            data: [
              {
                progress,
                count,
              },
            ],
          });
        } else {
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
            state.resultData[indexOfResults].data[
              indexOfObjWithProgress
            ].count = count;
          }
        }
      });
    },
    addPosData: (state, action: PayloadAction<SimulationVisMessage>) => {
      const { progress, objectCoords } = action.payload;
      const { name, coords } = objectCoords;

      const indexOfResults = findIndexOfResultDataByName(state, name);

      if (indexOfResults === -1) {
        state.resultData.push({
          name,
          ...initialResultDataWithMeta,
          data: [
            {
              progress,
              coords,
            },
          ],
        });
      } else {
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
      }
    },
    finishResults: (state) => {
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

      const maxProgressArr = restoredDataWithFlag.map(
        (value) => _.maxBy(value.data, (datum) => datum.progress).progress
      );

      state.maxProgress = _.max(maxProgressArr);
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(
      (action) => action.type.startsWith("simulation/add"),
      (
        state,
        action: PayloadAction<SimulationCountMessage | SimulationVisMessage>
      ) => {
        const { progress } = action.payload;
        state.simulationState = SimulationStates.RUNNING;
        state.maxProgress = Math.min(
          Math.max(state.maxProgress, progress),
          100
        );

        let names: string[] = [];

        if ((action.payload as SimulationVisMessage).objectCoords) {
          const visMsg = action.payload as SimulationVisMessage;
          names.push(visMsg.objectCoords.name);
        } else if ((action.payload as SimulationCountMessage).objectCounts) {
          const countMsg = action.payload as SimulationCountMessage;
          names = countMsg.objectCounts.map((count) => count.name);
        }

        names.forEach((name) => {
          const indexOfResults = findIndexOfResultDataByName(state, name);
          state.resultData[indexOfResults].isLoading = true;
          state.resultData[indexOfResults].hasCompleted = false;
        });
      }
    ),
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
export const selectProgress = (state: RootState) =>
  state.simulation.maxProgress;

export default simulationSlice.reducer;
