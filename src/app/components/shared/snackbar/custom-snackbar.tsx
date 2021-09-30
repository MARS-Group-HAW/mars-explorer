import * as React from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Props = {
  open: boolean;
  autoHideDuration: number;
  onClose?: () => void;
  severity: AlertProps["severity"];
  msg: string;
};

function CustomSnackbar({
  open,
  autoHideDuration,
  onClose,
  severity,
  msg,
}: Props) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
