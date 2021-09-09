import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../utils/store";
import {
  initialState as ValidationInitialState,
  reducers as ValidationReducer,
  State as ValidationState,
} from "../../../utils/validation-slice";

// Define a type for the slice state
type State = ValidationState & {
  path?: string;
};

// Define the initial state using that type
const initialState: State = {
  ...ValidationInitialState,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setPath: (state: State, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
    ...ValidationReducer,
  },
});

export const { setPath, setUnknownState, setValidState, setInvalidState } =
  configSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// TODO: connect to root store
export const selectConfigPath = (state: RootState) => state;

export default configSlice.reducer;
