import { useBoolean } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext } from "react";
import { IFileRef } from "@shared/types/File";
import { ModelRef } from "@shared/types/Model";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";

type State = {
  loadConfirmButton: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

function useCopyProjectDialogHook(
  fileRef: IFileRef,
  onClose: () => void
): State {
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isCreating, setIsCreating] = useBoolean(false);

  const handleClose = () => {
    setIsCreating(false);
    onClose();
  };

  const handleConfirm = async () => {
    setIsCreating(true);

    try {
      const modelRef = await window.api.invoke<string, ModelRef>(
        Channel.COPY_EXAMPLE_PROJECT,
        fileRef.path
      );
      addSuccessAlert({ msg: `Project "${modelRef.name}" was copied!` });
    } catch (e: any) {
      addErrorAlert({
        msg: `Project "${fileRef.name}" could not be copied. Make sure that this app has access to your document folder and that you do not have another project with the same name. (${e})`,
        timeout: 8000,
      });
    }
    handleClose();
  };

  const loadConfirmButton = isCreating;

  return {
    loadConfirmButton,
    handleClose,
    handleConfirm,
  };
}

export default useCopyProjectDialogHook;
