import * as React from "react";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import useNewProjectDialogHook from "./use-new-project-dialog.hook";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";

type Props = {
  open: boolean;
  onClose: () => void;
};

function NewProjectDialog({ open, onClose }: Props) {
  const {
    loadConfirmButton,
    disableConfirmButton,
    newProjectName,
    setNewProjectName,
    handleNewProjectDialogConfirm,
    handleNewProjectDialogClose,
  } = useNewProjectDialogHook(onClose);

  return (
    <DialogWithKeyListener
      open={open}
      onKeyPressed={handleNewProjectDialogConfirm}
      onClose={handleNewProjectDialogClose}
      disabled={disableConfirmButton}
    >
      <DialogTitle id="form-dialog-title">Create new Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new project, please enter a suitable name.
        </DialogContentText>
        <DialogContentText color="secondary">
          Keep in mind that the project cannot be renamed within this
          application.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="project-name"
          type="text"
          fullWidth
          value={newProjectName}
          helperText="The name should be unique and contain only letters"
          onChange={(ev) => setNewProjectName(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNewProjectDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleNewProjectDialogConfirm}
          color="primary"
          disabled={disableConfirmButton}
        >
          {loadConfirmButton ? (
            <CircularProgress variant="indeterminate" size={15} />
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </DialogWithKeyListener>
  );
}

export default NewProjectDialog;
