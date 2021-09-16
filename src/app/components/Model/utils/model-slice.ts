import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../utils/store";
import {
  initialLoadingState,
  loadingReducers,
  LoadingState,
} from "../../../utils/slices/loading-slice";
import LoadingSteps from "./LoadingSteps";

// Define a type for the slice state
type ModelState = LoadingState<LoadingSteps> & {
  hasErrorsIn: string[];
};

// Define the initial state using that type
const initialState: ModelState = {
  hasErrorsIn: [],
  ...initialLoadingState,
  maxSteps: Object.keys(LoadingSteps).length,
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    resetErrors: (state) => {
      state.hasErrorsIn = initialState.hasErrorsIn;
    },
    removeErrorsInPath: (state, { payload }: PayloadAction<string>) => {
      state.hasErrorsIn = state.hasErrorsIn.filter((path) => path !== payload);
    },
    setErrorsInPath: (state, { payload }: PayloadAction<string>) => {
      if (state.hasErrorsIn.includes(payload)) return;

      state.hasErrorsIn = [payload, ...state.hasErrorsIn];
    },
    ...loadingReducers<LoadingSteps>(),
  },
});

export const {
  removeErrorsInPath,
  resetErrors,
  setErrorsInPath,
  finishLoadingStep,
  resetLoadingStep,
  resetLoadingSteps,
} = modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;
export const selectMonacoServicesInstalled = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MONACO_SERVICES_INSTALLED);
export const selectModelFullyInitialized = (state: RootState): boolean =>
  state.model.finishedSteps.length === state.model.maxSteps;

export const selectModelLoadingProgress = (state: RootState) =>
  Math.floor((state.model.finishedSteps.length / state.model.maxSteps) * 100);

export default modelSlice.reducer;
