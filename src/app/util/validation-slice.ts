import ValidationState from "./types/validation-state";

export type State = {
  validationState: ValidationState;
};

// Define the initial state using that type
export const initialState: State = {
  validationState: ValidationState.UNKNOWN,
};

export const reducers = {
  setUnknownState: (state: State) => {
    state.validationState = ValidationState.UNKNOWN;
  },
  setValidState: (state: State) => {
    state.validationState = ValidationState.VALID;
  },
  setInvalidState: (state: State) => {
    state.validationState = ValidationState.INVALID;
  },
};
