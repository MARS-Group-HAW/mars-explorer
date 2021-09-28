import { createAction, createReducer, current } from "@reduxjs/toolkit";
import _ from "lodash";
import ResultData from "../../utils/ResultData";

type SingleState = {
  currentStep: number;
  indexOfPrevStepEnd: number;
  data: number[];
  lastResult: {
    currentStep?: number;
    indexOfPrevStepEnd?: number;
    data?: number;
  };
};

type State = {
  [key: string]: SingleState;
};

export const initialState: State = {};
const initialSingleState: SingleState = {
  currentStep: 0,
  indexOfPrevStepEnd: 0,
  data: [],
  lastResult: {},
};

const initFile = createAction<{ name: string }, "initFile">("initFile");
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
    .addCase(initFile, (state, { payload }) => {
      const { name } = payload;

      if (state[name]) return;

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

      const { currentStep, indexOfPrevStepEnd, data } = state[name].lastResult;
      state[name].currentStep = currentStep;
      state[name].indexOfPrevStepEnd = indexOfPrevStepEnd;
      state[name].data.push(data);
      state[name].lastResult = {};
    })
);

export { addLiveData, addLastData, initFile };

export default reducer;
