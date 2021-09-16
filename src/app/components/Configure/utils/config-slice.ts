import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../utils/store";
import {
  initialState as ValidationInitialState,
  reducers as ValidationReducer,
  State as ValidationState,
} from "../../../utils/slices/validation-slice";

// Define a type for the slice state
type State = ValidationState & {
  pathToConfigJson?: string;
};

// Define the initial state using that type
const initialState: State = {
  ...ValidationInitialState,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setPathToConfig: (state: State, { payload }: PayloadAction<string>) => {
      window.api.logger.info(`[CONFIG] ${payload}`);
      state.pathToConfigJson = payload;
    },
    ...ValidationReducer,
  },
});

export const {
  setPathToConfig,
  setLoadingState,
  setInvalidState,
  setValidState,
  setErrorState,
  setUnknownState,
} = configSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// TODO: connect to root store
export const selectConfigPath = (state: RootState) => state;

export default configSlice.reducer;
