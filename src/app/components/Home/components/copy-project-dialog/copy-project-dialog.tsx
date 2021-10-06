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
import { IFileRef } from "@shared/types/File";
import useCopyProjectDialogHook from "./use-copy-project-dialog.hook";

type Props = {
  projectToCopy: IFileRef;
  open: boolean;
  onClose: () => void;
};

function CopyProjectDialog({ open, onClose, projectToCopy }: Props) {
  const { loadConfirmButton, handleConfirm, handleClose } =
    useCopyProjectDialogHook(projectToCopy, onClose);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="form-dialog-title">
        Create a copy of {projectToCopy?.name} example Project
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          In order to make this project editable for you, we will create a copy
          of it. Please enter a suitable name.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={loadConfirmButton}
        >
          {loadConfirmButton ? (
            <CircularProgress variant="indeterminate" size={15} />
          ) : (
            "Create Copy"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CopyProjectDialog;
