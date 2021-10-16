import * as React from "react";
import {
  Button,
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
import DialogWithKeyListener from "../shared/dialog-with-key-listener";
import ValidationState from "../../utils/types/validation-state";
import StatusIndicator from "./components/status-indicator";

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
            cursor: errorMsg ? "pointer" : "initial",
          }}
          justifyContent="center"
          alignItems="center"
          onClick={() => errorMsg && openErrorDialog()}
        >
          <StatusIndicator
            showProgress={showProgress}
            progress={progress}
            simState={simState}
          />
        </Grid>
      </Grid>
      <DialogWithKeyListener
        open={showErrorDialog}
        onKeyPressed={closeErrorDialog}
        scroll="paper"
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">Last Error Message</DialogTitle>
        <DialogContent dividers>
          {errorMsg?.split("\n").map((msg) => (
            <DialogContentText
              tabIndex={-1}
              style={{ fontFamily: "monospace", color: "red" }}
            >
              {msg}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog}>Close</Button>
        </DialogActions>
      </DialogWithKeyListener>
    </>
  );
}

export default QuickStartBar;
