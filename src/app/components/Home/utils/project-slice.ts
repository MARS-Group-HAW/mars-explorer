import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelRef } from "@shared/types/Model";
import type { RootState } from "../../../utils/store";
import LocalStorageService, {
  CacheKey,
} from "../../../utils/local-storage-service";

// Define a type for the slice state
type ProjectState = Partial<ModelRef>;

// Define the initial state using that type
const initialState: ProjectState = {};

export const projectSlice = createSlice({
  name: "project",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<ModelRef>) => {
      LocalStorageService.setItem(CacheKey.LAST_PATH, action.payload.path);

      state.name = action.payload.name;
      state.path = action.payload.path;
    },
  },
});

export const { setProject } = projectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
