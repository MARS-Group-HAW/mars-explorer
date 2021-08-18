import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelRef } from "@shared/types/Model";
import type { RootState } from "../../App/utils/store";

// Define a type for the slice state
interface ProjectState extends ModelRef {}

// Define the initial state using that type
const initialState: ProjectState = null;

export const projectSlice = createSlice({
  name: "project",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set: (state, action: PayloadAction<ModelRef>) => action.payload,
  },
});

export const { set } = projectSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
