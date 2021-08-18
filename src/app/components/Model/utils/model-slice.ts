import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelFile } from "@shared/types/Model";
import type { RootState } from "../../App/utils/store";

// Define a type for the slice state
interface ModelState extends IModelFile {}

// Define the initial state using that type
const initialState: ModelState = null;

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
