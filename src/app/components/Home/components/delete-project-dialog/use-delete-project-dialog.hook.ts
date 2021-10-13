import { useBoolean, useLatest } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext } from "react";
import { IFileRef } from "@shared/types/File";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utils/hooks/use-store";
import { selectProject } from "../../utils/project-slice";
import { resetStore } from "../../../../utils/store";

type State = {
  loadConfirmButton: boolean;
  handleNewProjectDialogClose: () => void;
  handleNewProjectDialogConfirm: (ref: IFileRef) => void;
};

function useDeleteProjectDialogHook(onClose: () => void): State {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector(selectProject);
  const latestPath = useLatest(path);
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isDeleting, setIsDeleting] = useBoolean(false);

  const handleNewProjectDialogClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleNewProjectDialogConfirm = async (ref: IFileRef) => {
    setIsDeleting(true);
    const deleted = await window.api.invoke(
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

    if (ref.path === latestPath.current) {
      dispatch(resetStore());
    }

    handleNewProjectDialogClose();
  };

  return {
    loadConfirmButton: isDeleting,
    handleNewProjectDialogClose,
    handleNewProjectDialogConfirm,
  };
}

export default useDeleteProjectDialogHook;
