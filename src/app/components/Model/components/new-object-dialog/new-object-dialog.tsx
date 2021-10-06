import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SimObjects from "@shared/types/sim-objects";
import useNewObjectDialog from "./use-new-object-dialog.hook";
import ObjectButton from "../object-button";
import ConditionalTooltip from "../../../shared/conditional-tooltip";

const description: { [key in SimObjects]: string } = {
  [SimObjects.AGENT]:
    "Agents are the main part of every model (besides layers). Once the layers have been created, we can start specifying the the agents. For this step you, as a modeler, need to know what your agents are going to be, what attributes define them and what their actions will look like. Once this has been established, we can start with the agent creation.",
  [SimObjects.LAYER]:
    "Layers in MARS are instruments to fulfill the tasks of agent management or data management. Depending on your model, you will be using one or several different layer types. Baseline are the layers to manage agents. They are called that because they will contain the respective agents and manage their movements.",
  [SimObjects.ENTITY]: "Some description about entities ...", // TODO
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    width: 600,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  noSelectedText: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  objectDescription: {
    padding: theme.spacing(2),
    height: 200,
    textAlign: "justify",
  },
}));

function NewObjectDialog() {
  const classes = useStyles();

  const {
    loadConfirmButton,
    disableConfirmButton,
    newObjectName,
    setNewObjectName,
    selectedObject,
    onObjectTypeClick,
    isOpen,
    onDialogConfirm,
    onDialogClose,
  } = useNewObjectDialog();

  return (
    <Dialog open={isOpen} onClose={onDialogClose}>
      <DialogTitle id="form-dialog-title">Create new Class</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          To create a new class, select a type below.
        </DialogContentText>
        <Box className={classes.buttonGroup}>
          {Object.values(SimObjects).map((obj: SimObjects) => (
            <ObjectButton
              key={obj}
              object={obj}
              selected={obj === selectedObject}
              onClick={() => onObjectTypeClick(obj)}
            />
          ))}
        </Box>
        <Box className={classes.objectDescription}>
          {!selectedObject && (
            <div className={classes.noSelectedText}>
              <Typography variant="caption" color="textSecondary">
                Select an object type to see some information about it.
              </Typography>
            </div>
          )}
          {selectedObject && (
            <DialogContentText>{description[selectedObject]}</DialogContentText>
          )}
        </Box>
        <TextField
          margin="dense"
          variant="outlined"
          id="class-name"
          type="text"
          fullWidth
          value={newObjectName}
          label="Class Name"
          helperText="The name should be unique and contain only letters"
          onChange={(ev) => setNewObjectName(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} color="primary">
          Cancel
        </Button>
        <ConditionalTooltip
          show={disableConfirmButton && !loadConfirmButton}
          title={
            "Make sure that your name is unique and that you've selected a type."
          }
        >
          <span>
            <Button
              onClick={onDialogConfirm}
              color="primary"
              disabled={disableConfirmButton}
            >
              {loadConfirmButton ? (
                <CircularProgress variant="indeterminate" size={15} />
              ) : (
                "Create"
              )}
            </Button>
          </span>
        </ConditionalTooltip>
      </DialogActions>
    </Dialog>
  );
}

export default NewObjectDialog;
