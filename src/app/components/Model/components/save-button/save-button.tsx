import * as React from "react";
import { Fab, makeStyles } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectDirtyModels } from "../../utils/model-slice";
import { useSharedModels } from "../../hooks/use-shared-models";
import useSaveFile from "../../hooks/use-save-file";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function SaveButton() {
  const classes = useStyles();
  const { saveCurrentFile } = useSaveFile();
  const dirtyModels = useAppSelector(selectDirtyModels);
  const [{ selectedModel }] = useSharedModels();

  return (
    <Fab
      className={classes.saveButton}
      color="secondary"
      aria-label="save"
      type="submit"
      disabled={!selectedModel || dirtyModels.length === 0}
      onClick={saveCurrentFile}
    >
      <SaveIcon />
    </Fab>
  );
}

export default SaveButton;
