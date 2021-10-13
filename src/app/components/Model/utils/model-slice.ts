import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelFile, WorkingModel } from "@shared/types/Model";
import ExampleProject from "@shared/types/ExampleProject";
import type { RootState } from "../../../utils/store";
import {
  initialLoadingState,
  loadingReducers,
  LoadingState,
} from "../../../utils/slices/loading-slice";
import LoadingSteps from "./LoadingSteps";

// Define a type for the slice state
type ModelState = LoadingState<LoadingSteps> & {
  models: WorkingModel;
  exampleProjects: ExampleProject[];
  namesWithError: string[];
  dirtyModels: string[];
};

// Define the initial state using that type
const initialState: ModelState = {
  models: [],
  exampleProjects: [],
  namesWithError: [],
  dirtyModels: [],
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
    setExampleProjects: (
      state,
      { payload }: PayloadAction<ExampleProject[]>
    ) => {
      state.exampleProjects = payload;
    },
    addToDirtyFiles: (state, { payload }: PayloadAction<string>) => {
      state.dirtyModels.push(payload);
    },
    removeFromDirtyFiles: (state, { payload }: PayloadAction<string>) => {
      state.dirtyModels = state.dirtyModels.filter(
        (modelPath) => modelPath !== payload
      );
    },
    resetDirtyModels: (state) => {
      state.dirtyModels = initialState.dirtyModels;
    },
    resetErrors: (state) => {
      state.namesWithError = initialState.namesWithError;
    },
    removeErrorsInPath: (state, { payload }: PayloadAction<string>) => {
      state.namesWithError = state.namesWithError.filter(
        (path) => path !== payload
      );
    },
    setErrorsInPath: (state, { payload }: PayloadAction<string>) => {
      if (state.namesWithError.includes(payload)) return;

      state.namesWithError = [payload, ...state.namesWithError];
    },
    ...loadingReducers<LoadingSteps>(),
  },
});

export const {
  removeErrorsInPath,
  resetErrors,
  setExampleProjects,
  setErrorsInPath,
  finishLoadingStep,
  resetLoadingStep,
  addModel,
  removeModel,
  setModel,
  addToDirtyFiles,
  removeFromDirtyFiles,
} = modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;
export const selectModels = (state: RootState) => state.model.models;
export const selectExampleProjects = (state: RootState) =>
  state.model.exampleProjects;
export const selectErrors = (state: RootState) => state.model.namesWithError;
export const selectDirtyModels = (state: RootState) => state.model.dirtyModels;
export const selectModelsRead = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MODELS_READ);
export const selectLoadingSteps = (state: RootState) =>
  state.model.finishedSteps;
export const selectMonacoServicesInstallStatus = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MONACO_SERVICES_INSTALLED);
export const selectLanguageServerStartStatus = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.LANGUAGE_CLIENT_STARTED);
export const selectLanguageServerInitializeStatus = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.LANGUAGE_SERVER_INITIALIZED);
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
