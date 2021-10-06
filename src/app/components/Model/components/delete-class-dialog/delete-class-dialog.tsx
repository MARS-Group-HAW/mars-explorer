import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import useDeleteClassDialog from "./use-delete-object-dialog.hook";

function DeleteClassDialog() {
  const { name, isLoading, isOpen, onDialogConfirm, onDialogClose } =
    useDeleteClassDialog();

  return (
    <Dialog open={isOpen} onClose={onDialogClose}>
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
    </Dialog>
  );
}

export default DeleteClassDialog;
