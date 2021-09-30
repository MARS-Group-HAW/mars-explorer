import React, { createContext, ReactNode, useReducer } from "react";
import reducer, {
  addError,
  addInfo,
  addSuccess,
  addWarning,
  clearAlert,
  SnackbarMessage,
} from "./snackbar-reducer";
import CustomSnackbar from "./custom-snackbar";

type SnackbarFn = (msg: SnackbarMessage) => void;

export const SnackBarContext = createContext<{
  addInfoAlert: SnackbarFn;
  addSuccessAlert: SnackbarFn;
  addWarningAlert: SnackbarFn;
  addErrorAlert: SnackbarFn;
  clear: (msg: string) => void;
}>(null);

export function SnackBarProvider({ children }: { children: ReactNode }) {
  const [alerts, dispatch] = useReducer(reducer, []);

  const addInfoAlert = (alert: SnackbarMessage) => dispatch(addInfo(alert));
  const addSuccessAlert = (alert: SnackbarMessage) =>
    dispatch(addSuccess(alert));
  const addWarningAlert = (alert: SnackbarMessage) =>
    dispatch(addWarning(alert));
  const addErrorAlert = (alert: SnackbarMessage) => dispatch(addError(alert));
  const clear = (msg: string) => dispatch(clearAlert({ msg }));

  const value = {
    addInfoAlert,
    addSuccessAlert,
    addWarningAlert,
    addErrorAlert,
    clear,
  };

  return (
    <SnackBarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => (
        <CustomSnackbar
          key={alert.msg}
          open
          msg={alert.msg}
          autoHideDuration={alert.timeout}
          severity={alert.severity}
          onClose={() => clear(alert.msg)}
        />
      ))}
    </SnackBarContext.Provider>
  );
}

export default SnackBarProvider;
