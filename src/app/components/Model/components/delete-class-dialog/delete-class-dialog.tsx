import * as React from "react";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import useDeleteClassDialog from "./use-delete-object-dialog.hook";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";

function DeleteClassDialog() {
  const { name, isLoading, isOpen, onDialogConfirm, onDialogClose } =
    useDeleteClassDialog();

  return (
    <DialogWithKeyListener
      open={isOpen}
      onClose={onDialogClose}
      onKeyPressed={onDialogConfirm}
    >
      <DialogTitle>{`Delete Class "${name}"?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          autoFocus
          onClick={onDialogConfirm}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress variant="indeterminate" size={15} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </DialogWithKeyListener>
  );
}

export default DeleteClassDialog;
