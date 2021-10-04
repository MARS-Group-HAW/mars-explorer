import { useBoolean } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext } from "react";
import { IFileRef } from "@shared/types/File";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";

type State = {
  loadConfirmButton: boolean;
  handleNewProjectDialogClose: () => void;
  handleNewProjectDialogConfirm: (ref: IFileRef) => void;
};

function useDeleteProjectDialog(onClose: () => void): State {
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isDeleting, setIsDeleting] = useBoolean(false);

  const handleNewProjectDialogClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleNewProjectDialogConfirm = async (ref: IFileRef) => {
    setIsDeleting(true);
    const deleted = await window.api.invoke<string, boolean>(
      Channel.DELETE_FILE_OR_DIR,
      ref.path
    );
    if (deleted) {
      addSuccessAlert({ msg: `Project ${ref.name} was deleted.` });
    } else {
      addErrorAlert({
        msg: `Project "${ref.name}" could not be deleted.`,
      });
    }
    handleNewProjectDialogClose();
  };

  return {
    loadConfirmButton: isDeleting,
    handleNewProjectDialogClose,
    handleNewProjectDialogConfirm,
  };
}

export default useDeleteProjectDialog;
