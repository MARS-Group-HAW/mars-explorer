import { useCallback, useContext } from "react";
import monaco from "@app/standalone/monaco-editor/monaco";
import { Channel } from "@shared/types/Channel";
import { useAppDispatch } from "../../../utils/hooks/use-store";
import { useSharedModels } from "./use-shared-models";
import { SnackBarContext } from "../../shared/snackbar/snackbar-provider";
import { setDirtyStateInModel, setVersionId } from "../utils/model-slice";

type State = {
  saveCurrentFile: () => void;
};

function useSaveFile(): State {
  const dispatch = useAppDispatch();

  const [{ selectedModel }] = useSharedModels();
  const { addWarningAlert, addErrorAlert, addSuccessAlert } =
    useContext(SnackBarContext);

  const saveCurrentFile = useCallback(async () => {
    const currentModel = monaco.editor.getModel(
      monaco.Uri.file(selectedModel.path)
    );

    if (!currentModel) {
      addWarningAlert({ msg: "Something went wrong while saving your file." });
      return;
    }

    const { path, name } = selectedModel;

    const content = currentModel.getValue();

    try {
      await window.api.invoke(Channel.WRITE_CONTENT_TO_FILE, {
        path,
        content,
      });
      addSuccessAlert({ msg: `Saved ${name}.` });
      dispatch(setDirtyStateInModel({ path, isDirty: false }));
      dispatch(
        setVersionId({
          path,
          lastSavedVersion: currentModel.getAlternativeVersionId(),
        })
      );
    } catch (e: any) {
      addErrorAlert({ msg: `An error occurred while saving your file: ${e}` });
    }
  }, [selectedModel]);

  return { saveCurrentFile };
}

export default useSaveFile;
