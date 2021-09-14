import * as React from "react";
import { CircularProgress, Grid, Toolbar, Typography } from "@material-ui/core";
import useQuickStartBar from "@app/components/QuickStartBar/hooks";
import StatusChip from "@app/components/QuickStartBar/components/status-chip";
import ActionButton from "@app/components/QuickStartBar/components/action-button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";

function QuickStartBar() {
  const {
    projectName,
    modelState,
    configState,
    showStartLoading,
    disableStart,
    showStopLoading,
    disableStop,
    showLoading,
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
      <StatusChip label="Model" status={modelState} />
      <StatusChip label="Config" status={configState} />
      <ActionButton
        icon={<PlayCircleOutlineIcon />}
        isLoading={showStartLoading}
        disabled={disableStart}
        onClick={handleStart}
      >
        Start
      </ActionButton>
      <ActionButton
        icon={<StopIcon />}
        isLoading={showStopLoading}
        disabled={disableStop}
        onClick={handleStop}
      >
        Stop
      </ActionButton>
      <CircularProgress
        color="secondary"
        size={20}
        style={{ visibility: showLoading ? "visible" : "hidden" }}
      />
    </Grid>
  );
}

export default QuickStartBar;
