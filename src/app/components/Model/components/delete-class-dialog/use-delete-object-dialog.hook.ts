import { useContext } from "react";
import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";
import { useAppDispatch } from "../../../../utils/hooks/use-store";
import {
  removeErrorsInPath,
  removeFromDirtyFiles,
  removeModel,
  resetErrors,
} from "../../utils/model-slice";
import {
  closeModelDeletion,
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
  const [{ isDeleteDialogOpen, processedModel }, sharedModelDispatch] =
    useSharedModels();

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

    const deleted = await window.api.invoke<string, boolean>(
      Channel.DELETE_FILE_OR_DIR,
      path
    );

    if (deleted) {
      addSuccessAlert({ msg: `"${name}" has been deleted.` });
      dispatch(removeModel(processedModel));
      dispatch(removeFromDirtyFiles(processedModel.path));
      dispatch(resetErrors());
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
