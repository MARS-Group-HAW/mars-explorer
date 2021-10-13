import * as React from "react";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { IFileRef } from "@shared/types/File";
import useDeleteProjectDialogHook from "./use-delete-project-dialog.hook";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";

type Props = {
  fileRef: IFileRef;
  open: boolean;
  onClose: () => void;
};

function DeleteProjectDialog({ fileRef, open, onClose }: Props) {
  const {
    loadConfirmButton,
    handleNewProjectDialogConfirm,
    handleNewProjectDialogClose,
  } = useDeleteProjectDialogHook(onClose);

  const onConfirm = () => handleNewProjectDialogConfirm(fileRef);

  return (
    <DialogWithKeyListener
      open={open}
      disabled={loadConfirmButton}
      onKeyPressed={onConfirm}
      onClose={handleNewProjectDialogClose}
    >
      <DialogTitle id="form-dialog-title">Delete this project?</DialogTitle>
      <DialogContent>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <DialogContentText>You won't be able to restore it.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNewProjectDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          disabled={loadConfirmButton}
        >
          {loadConfirmButton ? (
            <CircularProgress variant="indeterminate" size={15} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </DialogWithKeyListener>
  );
}

export default DeleteProjectDialog;
