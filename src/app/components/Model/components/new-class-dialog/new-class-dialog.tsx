import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import LayerSelectButton from "../layer-select-button";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";

const description: { [key in SimObjects]: string } = {
  [SimObjects.AGENT]:
    "Agents are independent and active components that can sense surroundings and act upon these findings and their internal state (memory, goals, desires, ..).",
  [SimObjects.BASIC_LAYER]:
    "Layers represent the environment in which agents live and offer possibilities for input of various data formats. Basic Layer is the most simple layer without any predefined reference system.",
  [SimObjects.RASTER_LAYER]:
    "Raster layer and grid layer are able to process grid and raster data and can be viewed similar to a 2D matrix. Real numerical values are stored in a n x m matrix and have a certain semantic nominal value.",
  [SimObjects.VECTOR_LAYER]:
    "Vector layers are used to map vector objects that can be represented by points, lines or areas. Vector objects are the most commonly used types for modeling the simulated environment.r",
  [SimObjects.ENTITY]:
    "Entities are like agents components with a life-cycle (they are created initially, initialized with data and eventually removed from the simulation later). Unlike agents, they cannot act. They, therefore, represent model objects that exist in the model and can be used by the agent.",
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

function NewClassDialog() {
  const classes = useStyles();

  const {
    loadConfirmButton,
    disableConfirmButton,
    newClassName,
    setNewClassName,
    layerClassName,
    setLayerClassName,
    selectedType,
    onTypeClick,
    isOpen,
    onDialogConfirm,
    onDialogClose,
  } = useNewObjectDialog();

  return (
    <DialogWithKeyListener
      open={isOpen}
      onClose={onDialogClose}
      disabled={disableConfirmButton}
      onKeyPressed={onDialogConfirm}
    >
      <DialogTitle id="form-dialog-title">Create new Class</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          To create a new class, select a type below.
        </DialogContentText>
        <Box className={classes.buttonGroup}>
          <ObjectButton
            object={SimObjects.AGENT}
            selected={SimObjects.AGENT === selectedType}
            onClick={() => onTypeClick(SimObjects.AGENT)}
          />
          <LayerSelectButton
            selected={[
              SimObjects.BASIC_LAYER,
              SimObjects.RASTER_LAYER,
              SimObjects.VECTOR_LAYER,
            ].includes(selectedType)}
            onClick={(simObject) => onTypeClick(simObject)}
          />
          <ObjectButton
            object={SimObjects.ENTITY}
            selected={SimObjects.ENTITY === selectedType}
            onClick={() => onTypeClick(SimObjects.ENTITY)}
          />
        </Box>
        <Box className={classes.objectDescription}>
          {!selectedType && (
            <div className={classes.noSelectedText}>
              <Typography variant="caption" color="textSecondary">
                Select an object type to see some information about it.
              </Typography>
            </div>
          )}
          {selectedType && (
            <DialogContentText>{description[selectedType]}</DialogContentText>
          )}
        </Box>
        <TextField
          margin="dense"
          variant="outlined"
          id="class-name"
          type="text"
          fullWidth
          value={newClassName}
          label="Class Name"
          helperText="The name should be unique and contain only letters"
          onChange={(ev) => setNewClassName(ev.target.value)}
        />
        {selectedType === SimObjects.AGENT && (
          <TextField
            margin="dense"
            variant="outlined"
            id="class-name"
            type="text"
            fullWidth
            value={layerClassName}
            label="Layer the agent will be placed on"
            helperText="The name should be unique and contain only letters"
            onChange={(ev) => setLayerClassName(ev.target.value)}
          />
        )}
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
    </DialogWithKeyListener>
  );
}

export default NewClassDialog;
