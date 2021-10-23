import * as React from "react";
import { Grid, Toolbar, Typography } from "@material-ui/core";
import useQuickStartBar from "@app/components/QuickStartBar/hooks";
import StatusChip from "@app/components/QuickStartBar/components/status-chip";
import ActionButton from "@app/components/QuickStartBar/components/action-button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";
import { SimulationStates } from "@shared/types/SimulationStates";
import ValidationState from "../../utils/types/validation-state";
import StatusIndicator from "./components/status-indicator";
import OutputDialog from "./components/output-dialog";

function QuickStartBar() {
  const {
    projectName,
    modelState,
    modelErrorFiles,
    dirtyModelNames,
    configState,
    configErrors,
    disableStart,
    disableStop,
    simState,
    progress,
    showProgress,
    errorMsg,
    outputMsg,
    showOutputDialog,
    openOutputDialog,
    closeOutputDialog,
    handleStart,
    handleStop,
  } = useQuickStartBar();

  const hasFinishedState = [
    SimulationStates.SUCCESS,
    SimulationStates.FAILED,
    SimulationStates.TERMINATED,
  ].includes(simState);

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
          list={
            modelState === ValidationState.DIRTY
              ? dirtyModelNames
              : modelErrorFiles
          }
        />
        <StatusChip label="Config" status={configState} list={configErrors} />
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
        <Grid
          container
          style={{
            width: 40,
            cursor: hasFinishedState ? "pointer" : "initial",
          }}
          justifyContent="center"
          alignItems="center"
          onClick={() => hasFinishedState && openOutputDialog()}
        >
          <StatusIndicator
            showProgress={showProgress}
            progress={progress}
            simState={simState}
          />
        </Grid>
      </Grid>
      <OutputDialog
        open={showOutputDialog}
        onClose={closeOutputDialog}
        errorMsg={errorMsg}
        outputMsg={outputMsg}
      />
    </>
  );
}

export default QuickStartBar;
