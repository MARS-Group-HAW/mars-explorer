import * as React from "react";
import { Grid, Toolbar, Typography } from "@material-ui/core";
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
    case SimulationStates.CANCELED:
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
    disableStart,
    disableStop,
    simState,
    progress,
    showProgress,
    handleStart,
    handleStop,
  } = useQuickStartBar();

  return (
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

      <StatusChip label="Model" status={modelState} errors={modelErrorFiles} />
      <StatusChip label="Config" status={configState} />
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
      <div style={{ display: "flex", width: 40 }}>
        {!showProgress && getElBySimState(simState)}
        {showProgress && (
          <CircularProgressWithLabel
            hasStarted={simState === SimulationStates.RUNNING}
            value={progress}
          />
        )}
      </div>
    </Grid>
  );
}

export default QuickStartBar;
