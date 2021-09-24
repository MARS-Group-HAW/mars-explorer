import { createAction, createReducer } from "@reduxjs/toolkit";
import _ from "lodash";
import ResultData from "../../utils/ResultData";

type State = {
  currentStep: number;
  indexOfPrevStepEnd: number;
  data: number[];
  lastResult: {
    currentStep?: number;
    indexOfPrevStepEnd?: number;
    data?: number;
  };
};

export const initialState: State = {
  currentStep: 0,
  indexOfPrevStepEnd: 0,
  data: [],
  lastResult: {},
};

const addLiveData = createAction<ResultData, "addLiveData">("addLiveData");
const addLastData = createAction<void, "addLastData">("addLastData");

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
    .addCase(addLiveData, (state, { payload }) => {
      if (payload.length === 0) return;

      state.lastResult = {}; // reset last result

      const lastStepInData = getLastStep(payload); // 2
      const steps = getStepsOnly(payload); // [0,0,0,1,1,1,2,2,2]
      const { indexOfPrevStepEnd, currentStep } = state; // 0

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

        // we cannot be sure if these are the last steps
        if (i < lastStepInData) {
          state.currentStep = i + 1;
          state.indexOfPrevStepEnd = end;
          state.data.push(allCurrentStepsLength);
        } else {
          // preserve last result in case it's the last
          state.lastResult.currentStep = i;
          state.lastResult.indexOfPrevStepEnd = end;
          state.lastResult.data = allCurrentStepsLength;
        }
        newIndexOfPrevStepEnd = end;
      }
    })
    .addCase(addLastData, (state) => {
      const { currentStep, indexOfPrevStepEnd, data } = state.lastResult;
      state.currentStep = currentStep;
      state.indexOfPrevStepEnd = indexOfPrevStepEnd;
      state.data.push(data);
    })
);

export { addLiveData, addLastData };

export default reducer;
