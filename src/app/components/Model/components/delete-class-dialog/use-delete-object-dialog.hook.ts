import { useContext } from "react";
import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";
import { useAppDispatch } from "../../../../utils/hooks/use-store";
import { removeModel } from "../../utils/model-slice";
import {
  closeModelDeletion,
  resetSelectedModel,
  useSharedModels,
} from "../../hooks/use-shared-models";

type State = {
  isLoading: boolean;
  isOpen: boolean;
  name?: string;
  onDialogClose: () => void;
  onDialogConfirm: () => void;
};

function useDeleteClassDialog(): State {
  const dispatch = useAppDispatch();
  const [
    { isDeleteDialogOpen, processedModel, selectedModel },
    sharedModelDispatch,
  ] = useSharedModels();

  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useBoolean(false);

  const onDialogClose = () => {
    setIsLoading(false);
    sharedModelDispatch(closeModelDeletion);
  };

  const onDialogConfirm = async () => {
    if (!processedModel) {
      window.api.logger.warn("No class to delete.");
      return;
    }

    const { path, name } = processedModel;

    setIsLoading(true);

    const deleted = await window.api.invoke(Channel.DELETE_FILE_OR_DIR, path);

    if (deleted) {
      addSuccessAlert({ msg: `"${name}" has been deleted.` });

      if (processedModel?.path === selectedModel?.path) {
        sharedModelDispatch(resetSelectedModel);
      }

      dispatch(removeModel(processedModel));
    } else {
      addErrorAlert({
        msg: `An error occurred while deleting "${name}".`,
      });
    }

    onDialogClose();
    setIsLoading(false);
  };

  return {
    isOpen: isDeleteDialogOpen,
    isLoading,
    name: processedModel?.name,
    onDialogConfirm,
    onDialogClose,
  };
}

export default useDeleteClassDialog;
