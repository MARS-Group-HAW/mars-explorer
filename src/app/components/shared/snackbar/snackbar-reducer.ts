import { createAction, createReducer } from "@reduxjs/toolkit";

enum Severity {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
}

export type SnackbarMessage = {
  msg: string;
  timeout?: number;
};

type State = {
  msg: string;
  timeout?: number;
  severity: Severity;
}[];

export const addInfo = createAction<SnackbarMessage, "addInfo">("addInfo");
export const addError = createAction<SnackbarMessage, "addError">("addError");
export const addWarning = createAction<SnackbarMessage, "addWarning">(
  "addWarning"
);
export const addSuccess = createAction<SnackbarMessage, "addSuccess">(
  "addSuccess"
);
export const clearAlert = createAction<{ msg: string }, "clearAlert">(
  "clearAlert"
);

const initialState: State = [];

const messageToState = (
  { msg, timeout = 5000 }: SnackbarMessage,
  severity: Severity
) => ({
  msg,
  timeout,
  severity,
});

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(addInfo, (state, { payload }) => {
      window.api.logger.info(payload.msg);
      state.push(messageToState(payload, Severity.INFO));
    })
    .addCase(addSuccess, (state, { payload }) => {
      window.api.logger.info(payload.msg);
      state.push(messageToState(payload, Severity.SUCCESS));
    })
    .addCase(addWarning, (state, { payload }) => {
      window.api.logger.warn(payload.msg);
      state.push(messageToState(payload, Severity.WARNING));
    })
    .addCase(addError, (state, { payload }) => {
      window.api.logger.error(payload.msg);
      state.push(messageToState(payload, Severity.ERROR));
    })
    .addCase(clearAlert, (state, { payload }) =>
      state.filter((alert) => alert.msg !== payload.msg)
    )
);

export default reducer;
