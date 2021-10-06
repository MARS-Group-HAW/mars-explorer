import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ValidationState from "@app/utils/types/validation-state";
import type { RootState } from "../../../utils/store";

// Define a type for the slice state
type State = {
  status: ValidationState;
  config?: any;
  errors: string[];
};
// Define the initial state using that type
const initialState: State = {
  status: ValidationState.UNKNOWN,
  errors: [],
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, { payload }: PayloadAction<any>) => {
      state.config = payload;
    },
    resetConfig: () => initialState,
    setErrors: (state, { payload }: PayloadAction<string[]>) => {
      state.errors = payload;
    },
    setLoadingState: (state) => {
      state.status = ValidationState.LOADING;
    },
    setInvalidState: (state) => {
      state.status = ValidationState.INVALID;
    },
    setValidState: (state) => {
      state.status = ValidationState.VALID;
    },
    setDirtyState: (state) => {
      state.status = ValidationState.DIRTY;
    },
    setErrorState: (state) => {
      state.status = ValidationState.ERROR;
    },
    setUnknownState: (state) => {
      state.status = ValidationState.UNKNOWN;
    },
  },
});

export const {
  setLoadingState,
  setInvalidState,
  setValidState,
  setErrorState,
  setDirtyState,
  setUnknownState,
  setConfig,
  setErrors,
  resetConfig,
} = configSlice.actions;

export const selectConfig = (state: RootState) => state.config.config;
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigErrors = (state: RootState) => state.config.errors;

export const selectConfigLoading = (state: RootState) =>
  state.config.status === ValidationState.LOADING;

export const selectConfigHasBeenChecked = (state: RootState) =>
  state.config.status === ValidationState.VALID ||
  state.config.status === ValidationState.INVALID ||
  state.config.status === ValidationState.DIRTY;

export default configSlice.reducer;
