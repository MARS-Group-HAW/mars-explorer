import * as React from "react";
import { useCallback, useContext } from "react";
import { Fab, makeStyles } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import monaco from "@app/standalone/monaco-editor/monaco";
import { Channel } from "@shared/types/Channel";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utils/hooks/use-store";
import {
  removeFromDirtyFiles,
  selectDirtyModels,
} from "../../utils/model-slice";
import { useSharedModels } from "../../hooks/use-shared-models";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function SaveButton() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const dirtyModels = useAppSelector(selectDirtyModels);
  const [{ selectedModel }] = useSharedModels();
  const { addWarningAlert, addErrorAlert, addSuccessAlert } =
    useContext(SnackBarContext);

  const save = useCallback(async () => {
    const currentModel = monaco.editor.getModel(
      monaco.Uri.file(selectedModel.path)
    );

    if (!currentModel) {
      addWarningAlert({ msg: "Something went wrong while saving your file." });
      return;
    }

    const { path } = selectedModel;

    const content = currentModel.getValue();

    try {
      await window.api.invoke<{ path: string; content: string }, void>(
        Channel.WRITE_CONTENT_TO_FILE,
        {
          path,
          content,
        }
      );
      addSuccessAlert({ msg: `Saved ${selectedModel.name}.` });
      dispatch(removeFromDirtyFiles(path));
    } catch (e: any) {
      addErrorAlert({ msg: `An error occured while saving your file: ${e}` });
    }
  }, [selectedModel]);

  return (
    <Fab
      className={classes.saveButton}
      color="secondary"
      aria-label="save"
      type="submit"
      disabled={!selectedModel || dirtyModels.length === 0}
      onClick={save}
    >
      <SaveIcon />
    </Fab>
  );
}

export default SaveButton;
