import { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export type LoadingState<LoadingSteps> = {
  finishedSteps: LoadingSteps[];
  maxSteps: number;
};

export const initialLoadingState: Pick<LoadingState<any>, "finishedSteps"> = {
  finishedSteps: [],
};

export const loadingReducers = <T>() => ({
  finishLoadingStep: (
    state: LoadingState<T>,
    { payload }: PayloadAction<T>
  ) => {
    const foundStep = state.finishedSteps.find((step) => step === payload);

    if (foundStep) return;

    state.finishedSteps = [...state.finishedSteps, payload];
  },
  resetLoadingStep: (state: LoadingState<T>, { payload }: PayloadAction<T>) => {
    state.finishedSteps = state.finishedSteps.filter(
      (step) => step !== payload
    );
  },
  resetLoadingSteps: (state: LoadingState<T>) => {
    state.finishedSteps = [];
  },
});
