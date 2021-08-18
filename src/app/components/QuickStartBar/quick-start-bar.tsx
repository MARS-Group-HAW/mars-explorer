import * as React from "react";
import { Grid, Toolbar, Typography } from "@material-ui/core";
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
    areActionsDisabled,
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
        disabled={areActionsDisabled}
        onClick={handleStart}
      >
        Start
      </ActionButton>
      <ActionButton
        icon={<StopIcon />}
        disabled={areActionsDisabled}
        onClick={handleStop}
      >
        Stop
      </ActionButton>
    </Grid>
  );
}

export default QuickStartBar;
