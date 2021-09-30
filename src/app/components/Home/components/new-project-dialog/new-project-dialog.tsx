import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import useNewProjectDialogHook from "./use-new-project-dialog.hook";

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
    <Dialog open={open} onClose={handleNewProjectDialogClose}>
      <DialogTitle id="form-dialog-title">Create new Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new project, please enter a suitable name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="project-name"
          label="Project Name"
          type="text"
          fullWidth
          value={newProjectName}
          helperText="This name should be unique"
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
    </Dialog>
  );
}

export default NewProjectDialog;
