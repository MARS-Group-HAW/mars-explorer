import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelFile } from "@shared/types/Model";
import type { RootState } from "../../../utils/store";

// Define a type for the slice state
type ModelState = Partial<IModelFile>;

// Define the initial state using that type
const initialState: ModelState = {};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<IModelFile>) => action.payload,
  },
});

export const { set } = modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;

export default modelSlice.reducer;
