import { useBoolean } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext, useState } from "react";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";

type State = {
  disableConfirmButton: boolean;
  loadConfirmButton: boolean;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  handleNewProjectDialogClose: () => void;
  handleNewProjectDialogConfirm: () => void;
};

function useNewProjectDialogHook(onClose: () => void): State {
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isCreating, setIsCreating] = useBoolean(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleNewProjectDialogClose = () => {
    setNewProjectName("");
    setIsCreating(false);
    onClose();
  };

  const handleNewProjectDialogConfirm = () => {
    setIsCreating(true);
    window.api.send<string>(Channel.CREATE_PROJECT, newProjectName);
    window.api.on<boolean>(Channel.PROJECT_CREATED, (success) => {
      if (success) {
        addSuccessAlert({ msg: `Project ${newProjectName} created!` });
      } else {
        addErrorAlert({
          msg: `Project "${newProjectName}" could not be created. Make sure that this app has access to your document folder and that your project name is unique.`,
          timeout: 8000,
        });
      }
      handleNewProjectDialogClose();
    });
  };

  const disableConfirmButton = newProjectName.length === 0;
  const loadConfirmButton = isCreating;

  return {
    disableConfirmButton,
    loadConfirmButton,
    newProjectName,
    setNewProjectName,
    handleNewProjectDialogClose,
    handleNewProjectDialogConfirm,
  };
}

export default useNewProjectDialogHook;
