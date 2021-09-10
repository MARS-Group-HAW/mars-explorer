import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelRef } from "@shared/types/Model";
import type { RootState } from "../../../utils/store";
import LocalStorageService, {
  CacheKey,
} from "../../../utils/local-storage-service";

export enum LoadingState {
  NOT_STARTED,
  STARTED,
  ONE_THIRD,
  TWO_THIRDS,
  THREE_THIRDS,
  FINISHED,
  UNKNOWN,
}

// Define a type for the slice state
type ProjectState = Partial<ModelRef> & {
  loadingState: LoadingState;
};

// Define the initial state using that type
const initialState: ProjectState = {
  loadingState: LoadingState.NOT_STARTED,
};

export const projectSlice = createSlice({
  name: "project",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set: (state, action: PayloadAction<ModelRef>) => {
      LocalStorageService.setItem(CacheKey.LAST_PATH, action.payload.path);
      return {
        ...action.payload,
        loadingState:
          action.payload.path === state.path
            ? state.loadingState
            : LoadingState.NOT_STARTED,
      };
    },
    resetLoading: (state) => ({
      ...state,
      loadingState: LoadingState.NOT_STARTED,
    }),
    startLoading: (state) => ({ ...state, loadingState: LoadingState.STARTED }),
    setOneThirdLoaded: (state) => ({
      ...state,
      loadingState: LoadingState.ONE_THIRD,
    }),
    setTwoThirdsLoaded: (state) => ({
      ...state,
      loadingState: LoadingState.TWO_THIRDS,
    }),
    setThreeThirdsLoaded: (state) => ({
      ...state,
      loadingState: LoadingState.THREE_THIRDS,
    }),
    finishLoading: (state) => ({
      ...state,
      loadingState: LoadingState.FINISHED,
    }),
    setUnknown: (state) => ({
      ...state,
      loadingState: LoadingState.UNKNOWN,
    }),
  },
});

export const {
  set,
  resetLoading,
  startLoading,
  finishLoading,
  setOneThirdLoaded,
  setTwoThirdsLoaded,
  setThreeThirdsLoaded,
} = projectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
