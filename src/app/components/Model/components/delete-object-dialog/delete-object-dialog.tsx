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
import { makeStyles } from "@material-ui/core/styles";
import { IModelFile } from "@shared/types/Model";
import useDeleteObjectDialog from "./use-delete-object-dialog.hook";

type Props = {
  open: boolean;
  objectToDelete?: IModelFile;
  onClose: () => void;
};

const useStyles = makeStyles(() => ({}));

function DeleteObjectDialog({ open, onClose, objectToDelete }: Props) {
  const { isLoading, onObjectDeleteDialogConfirm, onObjectDeleteDialogClose } =
    useDeleteObjectDialog(onClose, objectToDelete);

  return (
    <Dialog open={open} onClose={onObjectDeleteDialogClose}>
      <DialogTitle>{`Delete ${objectToDelete?.name} ?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onObjectDeleteDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          autoFocus
          onClick={onObjectDeleteDialogConfirm}
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

export default DeleteObjectDialog;
