import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import useQuickStartBar from "@app/components/QuickStartBar/hooks";
import StatusChip from "@app/components/QuickStartBar/components/status-chip";
import ActionButton from "@app/components/QuickStartBar/components/action-button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorIcon from "@material-ui/icons/Error";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PanToolIcon from "@material-ui/icons/PanTool";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { SimulationStates } from "@shared/types/SimulationStates";
import CircularProgressWithLabel from "./components/CircularProgressWithLabel";

function getElBySimState(simState: SimulationStates) {
  switch (simState) {
    case SimulationStates.SUCCESS:
      return <CheckCircleOutlineIcon color="secondary" />;
    case SimulationStates.FAILED:
      return <ErrorIcon color="secondary" />;
    case SimulationStates.PAUSED:
      return <PauseCircleOutlineIcon color="secondary" />;
    case SimulationStates.TERMINATED:
      return <PanToolIcon color="secondary" />;
    case SimulationStates.NONE:
      return <HourglassEmptyIcon color="secondary" />;
    case SimulationStates.UNKNOWN:
    default:
      return <HelpOutlineIcon />;
  }
}

function QuickStartBar() {
  const {
    projectName,
    modelState,
    modelErrorFiles,
    configState,
    configErrors,
    disableStart,
    disableStop,
    simState,
    progress,
    showProgress,
    errorMsg,
    showErrorDialog,
    openErrorDialog,
    closeErrorDialog,
    handleStart,
    handleStop,
  } = useQuickStartBar();

  return (
    <>
      <Grid
        style={{ height: "100%" }}
        component={Toolbar}
        variant="dense"
        container
        justifyContent="space-around"
      >
        <Grid item xs={3}>
          <Typography variant="h6">{projectName}</Typography>
        </Grid>
        <StatusChip
          label="Model"
          status={modelState}
          errors={modelErrorFiles}
        />
        <StatusChip label="Config" status={configState} errors={configErrors} />
        <ActionButton
          icon={<PlayCircleOutlineIcon />}
          disabled={disableStart}
          onClick={handleStart}
        >
          Start
        </ActionButton>
        <ActionButton
          icon={<StopIcon />}
          disabled={disableStop}
          onClick={handleStop}
        >
          Stop
        </ActionButton>
        <div
          role="progressbar"
          style={{
            display: "flex",
            width: 40,
            cursor: errorMsg ? "pointer" : "initial",
          }}
          onClick={() => errorMsg && openErrorDialog()}
        >
          {!showProgress && getElBySimState(simState)}
          {showProgress && (
            <CircularProgressWithLabel
              hasStarted={simState === SimulationStates.RUNNING}
              value={progress}
            />
          )}
        </div>
      </Grid>
      <Dialog open={showErrorDialog} scroll="paper">
        <DialogTitle id="scroll-dialog-title">Last Error Message</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
            style={{ fontFamily: "monospace", color: "red" }}
          >
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default QuickStartBar;
