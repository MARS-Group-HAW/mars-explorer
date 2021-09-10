import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelRef } from "@shared/types/Model";
import type { RootState } from "../../../utils/store";
import LocalStorageService, {
  CacheKey,
} from "../../../utils/local-storage-service";

export enum LoadingSteps {
  DOTNET_INSTALLED = "DOTNET_INSTALLED",
  MONACO_SERVICES_INSTALLED = "MONACO_SERVICES_INSTALLED",
  LANGUAGE_CLIENT_STARTED = "LANGUAGE_CLIENT_STARTED",
}

// Define a type for the slice state
type ProjectState = Partial<ModelRef> & {
  finishedSteps: LoadingSteps[];
  maxSteps: number;
};

// Define the initial state using that type
const initialState: ProjectState = {
  finishedSteps: [],
  maxSteps: Object.keys(LoadingSteps).length,
};

export const projectSlice = createSlice({
  name: "project",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<ModelRef>) => {
      LocalStorageService.setItem(CacheKey.LAST_PATH, action.payload.path);

      const isSameProject = action.payload.path === state.path;

      state.name = action.payload.name;
      state.path = action.payload.path;
      state.finishedSteps = isSameProject ? state.finishedSteps : [];
    },
    finishLoadingStep: (state, { payload }: PayloadAction<LoadingSteps>) => {
      const foundStep = state.finishedSteps.find((step) => step === payload);

      if (foundStep) return;

      state.finishedSteps = [...state.finishedSteps, payload];
    },
    resetLoadingSteps: (state) => {
      state.finishedSteps = [];
    },
  },
});

export const { setProject, resetLoadingSteps, finishLoadingStep } =
  projectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;
export const selectProgress = (state: RootState) =>
  Math.floor(
    (state.project.finishedSteps.length / state.project.maxSteps) * 100
  );

export default projectSlice.reducer;
