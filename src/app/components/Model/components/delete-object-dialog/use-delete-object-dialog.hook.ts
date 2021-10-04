import { useContext } from "react";
import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import { IModelFile } from "@shared/types/Model";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";
import { useAppDispatch } from "../../../../utils/hooks/use-store";
import { removeModel } from "../../utils/model-slice";

type State = {
  isLoading: boolean;
  onObjectDeleteDialogClose: () => void;
  onObjectDeleteDialogConfirm: () => void;
};

function useDeleteObjectDialog(
  onClose: () => void,
  objectToDelete?: IModelFile
): State {
  const dispatch = useAppDispatch();
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useBoolean(false);

  const onObjectDeleteDialogClose = () => {
    setIsLoading(false);
    onClose();
  };

  const onObjectDeleteDialogConfirm = async () => {
    if (!objectToDelete) {
      window.api.logger.warn("No object to delete.");
      return;
    }

    const { path, name } = objectToDelete;

    setIsLoading(true);

    const deleted = await window.api.invoke<string, boolean>(
      Channel.DELETE_FILE_OR_DIR,
      path
    );

    if (deleted) {
      addSuccessAlert({ msg: `"${name}" has been deleted.` });
      dispatch(removeModel(objectToDelete));
    } else {
      addErrorAlert({
        msg: `An error occurred while deleting "${name}".`,
      });
    }

    onObjectDeleteDialogClose();
    setIsLoading(false);
  };

  return {
    isLoading,
    onObjectDeleteDialogConfirm,
    onObjectDeleteDialogClose,
  };
}

export default useDeleteObjectDialog;
