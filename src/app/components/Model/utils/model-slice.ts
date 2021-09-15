import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../utils/store";

// Define a type for the slice state
type ModelState = {
  hasErrorsIn: string[];
};

// Define the initial state using that type
const initialState: ModelState = {
  hasErrorsIn: [],
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
  },
});

export const { removeErrorsInPath, resetErrors, setErrorsInPath } =
  modelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModel = (state: RootState) => state.model;

export default modelSlice.reducer;
