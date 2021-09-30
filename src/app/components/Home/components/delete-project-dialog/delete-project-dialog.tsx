import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { IFileRef } from "@shared/types/File";
import useDeleteProjectDialog from "./use-delete-project.dialog";

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
  } = useDeleteProjectDialog(onClose);

  return (
    <Dialog open={open} onClose={handleNewProjectDialogClose}>
      <DialogTitle id="form-dialog-title">Delete this project?</DialogTitle>
      <DialogActions>
        <Button onClick={handleNewProjectDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleNewProjectDialogConfirm(fileRef)}
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
    </Dialog>
  );
}

export default DeleteProjectDialog;
