import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelFile, WorkingModel } from "@shared/types/Model";
import type { RootState } from "../../../utils/store";
import { initialLoadingState, loadingReducers, LoadingState } from "../../../utils/slices/loading-slice";
import LoadingSteps from "./LoadingSteps";

// Define a type for the slice state
type ModelState = LoadingState<LoadingSteps> & {
  models: WorkingModel;
  hasErrorsIn: string[];
};

// Define the initial state using that type
const initialState: ModelState = {
  models: [],
  hasErrorsIn: [],
  ...initialLoadingState,
  maxSteps: Object.keys(LoadingSteps).length,
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    addModel: (state, { payload }: PayloadAction<IModelFile>) => {
      state.models.push(payload);
    },
    removeModel: (state, { payload }: PayloadAction<IModelFile>) => {
      state.models = state.models.filter(
        (model) => model.path !== payload.path
      );
    },
    setModel: (state, { payload }: PayloadAction<WorkingModel>) => {
      state.models = payload;
    },
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
  addModel,
  removeModel,
  setModel,
} = modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;
export const selectModels = (state: RootState) => state.model.models;
export const selectMonacoServicesInstalled = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MONACO_SERVICES_INSTALLED);
export const selectStepWithStatus = (
  state: RootState
): { step: LoadingSteps; isLoading: boolean }[] =>
  Object.keys(LoadingSteps).map((step) => ({
    step: step as LoadingSteps,
    isLoading: !state.model.finishedSteps.includes(step as LoadingSteps),
  }));
export const selectModelFullyInitialized = (state: RootState): boolean =>
  state.model.finishedSteps.length === state.model.maxSteps;

export const selectModelLoadingProgress = (state: RootState) =>
  Math.floor((state.model.finishedSteps.length / state.model.maxSteps) * 100);

export default modelSlice.reducer;
