import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelFile, WorkingModel } from "@shared/types/Model";
import ExampleProject from "@shared/types/ExampleProject";
import type { RootState } from "../../../utils/store";
import {
  loadingReducers,
  LoadingState,
} from "../../../utils/slices/loading-slice";
import LoadingSteps from "./LoadingSteps";

type ModelWithMeta = {
  model: IModelFile;
  isDirty: boolean;
  isErroneous: boolean;
  lastSavedVersion: number;
};

type ModelId = {
  path: string;
};

type ErrorPayload = ModelId & Pick<ModelWithMeta, "isErroneous">;
type DirtyPayload = ModelId & Pick<ModelWithMeta, "isDirty">;
type VersionPayload = ModelId & Pick<ModelWithMeta, "lastSavedVersion">;

// Define a type for the slice state
type ModelState = LoadingState<LoadingSteps> & {
  models: ModelWithMeta[];
  exampleProjects: ExampleProject[];
};

// Define the initial state using that type
export const initialState: ModelState = {
  models: [],
  exampleProjects: [],
  finishedSteps: [],
  maxSteps: Object.keys(LoadingSteps).length,
};

const findIndexOfModelByPath = (
  modelsWithMeta: ModelWithMeta[],
  searchPath: string
) => modelsWithMeta.findIndex(({ model }) => model.path === searchPath);

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    addModel: (state, { payload }: PayloadAction<IModelFile>) => {
      state.models.push({
        model: payload,
        isDirty: false,
        isErroneous: false,
        lastSavedVersion: 1,
      });
    },
    removeModel: (state, { payload }: PayloadAction<IModelFile>) => {
      state.models = state.models.filter(
        ({ model }) => model.path !== payload.path
      );
    },
    setModel: (state, { payload }: PayloadAction<WorkingModel>) => {
      state.models = payload.map((model) => ({
        model,
        isDirty: false,
        isErroneous: false,
        lastSavedVersion: 1,
      }));
    },
    setExampleProjects: (
      state,
      { payload }: PayloadAction<ExampleProject[]>
    ) => {
      state.exampleProjects = payload;
    },
    setErrorStateInModel: (state, { payload }: PayloadAction<ErrorPayload>) => {
      const { path, isErroneous } = payload;
      const indexOfModel = findIndexOfModelByPath(state.models, path);

      if (indexOfModel === -1) {
        window.api.logger.warn(`Model ${path} was not found.`);
        return;
      }

      state.models[indexOfModel].isErroneous = isErroneous;
    },
    setDirtyStateInModel: (state, { payload }: PayloadAction<DirtyPayload>) => {
      const { path, isDirty } = payload;
      const indexOfModel = findIndexOfModelByPath(state.models, path);

      if (indexOfModel === -1) {
        window.api.logger.warn(`Model ${path} was not found.`);
        return;
      }

      state.models[indexOfModel].isDirty = isDirty;
    },
    resetDirtyModels: (state) => {
      state.models = state.models.map((model) => ({
        ...model,
        isDirty: false,
      }));
    },
    resetErrors: (state) => {
      state.models = state.models.map((model) => ({
        ...model,
        isErroneous: false,
      }));
    },
    setVersionId: (state, { payload }: PayloadAction<VersionPayload>) => {
      const { path, lastSavedVersion } = payload;
      const indexOfModel = findIndexOfModelByPath(state.models, path);

      if (indexOfModel === -1) {
        window.api.logger.warn(`Model ${path} was not found.`);
        return;
      }

      state.models[indexOfModel].lastSavedVersion = lastSavedVersion;
    },
    ...loadingReducers<LoadingSteps>(),
  },
});

export const {
  resetErrors,
  setExampleProjects,
  finishLoadingStep,
  resetLoadingStep,
  addModel,
  removeModel,
  setModel,
  setErrorStateInModel,
  setDirtyStateInModel,
  setVersionId,
  resetDirtyModels,
  resetLoadingSteps,
} = modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;
export const selectModels = (state: RootState) => state.model.models;
export const selectModelsWithoutMeta = (state: RootState) =>
  state.model.models.map((model) => model.model);
export const selectExampleProjects = (state: RootState) =>
  state.model.exampleProjects;
export const selectModelVersionByPath = (state: RootState) => {
  const modelsPathWithVersion: Record<string, number> = {};

  state.model.models.forEach(({ model, lastSavedVersion }) => {
    modelsPathWithVersion[model.path] = lastSavedVersion;
  });

  return modelsPathWithVersion;
};

export const selectErrors = (state: RootState) =>
  state.model.models
    .filter((model) => model.isErroneous)
    .map((model) => model.model.name);
export const selectModelsPathWithError = (state: RootState) =>
  state.model.models
    .filter((model) => model.isErroneous)
    .map((model) => model.model.path);
export const selectDirtyModels = (state: RootState) =>
  state.model.models
    .filter((model) => model.isDirty)
    .map((model) => model.model.name);
export const selectModelsRead = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MODELS_READ);
export const selectLoadingSteps = (state: RootState) =>
  state.model.finishedSteps;
export const selectFrameworkAdded = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.MARS_FRAMEWORK_ADDED);
export const selectProjectRestored = (state: RootState) =>
  state.model.finishedSteps.includes(LoadingSteps.PROJECT_RESTORED);
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
