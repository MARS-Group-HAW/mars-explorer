import { createAction, createReducer } from "@reduxjs/toolkit";
import _ from "lodash";
import ResultData from "../../utils/ResultData";

export type SingleDataState = {
  currentStep: number;
  indexOfPrevStepEnd: number;
  data: number[];
  lastResult: {
    currentStep?: number;
    indexOfPrevStepEnd?: number;
    data?: number;
  };
};

export type DataState = {
  [key: string]: SingleDataState;
};

export const initialState: DataState = {};
const initialSingleState: SingleDataState = {
  currentStep: 0,
  indexOfPrevStepEnd: 0,
  data: [],
  lastResult: {},
};

const initFileIfNotExists = createAction<
  { name: string },
  "initFileIfNotExists"
>("initFileIfNotExists");
const resetFile = createAction<{ name: string }, "resetFile">("resetFile");
const addLiveData = createAction<
  { name: string; data: ResultData },
  "addLiveData"
>("addLiveData");
const addLastData = createAction<{ name: string }, "addLastData">(
  "addLastData"
);

function getIndices(
  steps: number[],
  currentStep: number,
  indexOfStepChange: number
) {
  const start = indexOfStepChange;
  const end = _.lastIndexOf(steps, currentStep) + 1;
  const allCurrentStepsLength = _.slice(steps, start, end).length;
  return { end, allCurrentStepsLength };
}

const getLastStep = (data: ResultData) => _.last(data)?.Step;
const getStepsOnly = (data: ResultData) => data.map((datum) => datum.Step);

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(initFileIfNotExists, (state, { payload }) => {
      const { name } = payload;

      if (state[name]) return;

      state[name] = initialSingleState;
    })
    .addCase(resetFile, (state, { payload }) => {
      const { name } = payload;
      state[name] = initialSingleState;
    })
    .addCase(addLiveData, (state, { payload }) => {
      const { name, data } = payload;

      if (data.length === 0) return;

      const lastStepInData = getLastStep(data); // 2
      const steps = getStepsOnly(data); // [0,0,0,1,1,1,2,2,2]
      const { indexOfPrevStepEnd, currentStep } = state[name]; // 0

      for (
        let i = currentStep, newIndexOfPrevStepEnd = indexOfPrevStepEnd;
        i <= lastStepInData;
        i++
      ) {
        const { end, allCurrentStepsLength } = getIndices(
          steps,
          i,
          newIndexOfPrevStepEnd
        );

        state[name].currentStep = i;

        // we cannot be sure if these are the last steps
        if (i < lastStepInData) {
          state[name].indexOfPrevStepEnd = end;
          state[name].data.push(allCurrentStepsLength);
        } else {
          // preserve last result in case it's the last
          state[name].lastResult.currentStep = i;
          state[name].lastResult.indexOfPrevStepEnd = end;
          state[name].lastResult.data = allCurrentStepsLength;
        }
        newIndexOfPrevStepEnd = end;
      }
    })
    .addCase(addLastData, (state, { payload }) => {
      const { name } = payload;

      if (!state[name]) {
        window.api.logger.warn(
          `data-set-reducer: No last result found for ${name}.`
        );
        return;
      }

      const { currentStep, indexOfPrevStepEnd, data } = state[name].lastResult;
      state[name].currentStep = currentStep;
      state[name].indexOfPrevStepEnd = indexOfPrevStepEnd;
      state[name].data.push(data);
      state[name].lastResult = {};
    })
);

export { addLiveData, addLastData, initFileIfNotExists };

export default reducer;
