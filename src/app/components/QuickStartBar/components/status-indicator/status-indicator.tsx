import * as React from "react";
import { useEffect } from "react";
import { SimulationStates } from "@shared/types/SimulationStates";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorIcon from "@material-ui/icons/Error";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PanToolIcon from "@material-ui/icons/PanTool";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Tooltip } from "@material-ui/core";
import { useBoolean, useTimeoutFn } from "react-use";
import CircularProgressWithLabel from "../CircularProgressWithLabel";

type Props = {
  showProgress: boolean;
  progress: number;
  simState: SimulationStates;
};

function getIconBySimState(simState: SimulationStates) {
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

function getLabelBySimState(simState: SimulationStates) {
  switch (simState) {
    case SimulationStates.SUCCESS:
      return "Simulation has finished. Click here to show the output.";
    case SimulationStates.STARTED:
      return "Building ...";
    case SimulationStates.RUNNING:
      return "Running ...";
    case SimulationStates.FAILED:
      return "Simulation has failed. Click here to show the error message.";
    case SimulationStates.PAUSED:
      return "Simulation has been paused.";
    case SimulationStates.TERMINATED:
      return "You've terminated the simulation. Click here to show the output.";
    case SimulationStates.NONE:
      return "Waiting for action.";
    case SimulationStates.UNKNOWN:
    default:
      return "Unknown status";
  }
}

const isFinishedState = (state: SimulationStates) =>
  [SimulationStates.SUCCESS, SimulationStates.TERMINATED].includes(state);

function StatusIndicator({ showProgress, progress, simState }: Props) {
  const [openTooltip, setTooltipShow] = useBoolean(false);

  const [, , reset] = useTimeoutFn(() => setTooltipShow(false), 5000);

  useEffect(() => {
    if (isFinishedState(simState)) {
      setTooltipShow(true);
      reset();
    }
  }, [simState]);

  const icon = getIconBySimState(simState);
  const title = getLabelBySimState(simState);

  if (!isFinishedState(simState) || !openTooltip) {
    return (
      <Tooltip key="hover-tooltip" arrow title={title}>
        {showProgress ? (
          <span>
            <CircularProgressWithLabel
              hasStarted={simState === SimulationStates.RUNNING}
              value={progress}
            />
          </span>
        ) : (
          icon
        )}
      </Tooltip>
    );
  }

  return (
    <Tooltip key="timeout-tooltip" arrow title={title} open>
      {icon}
    </Tooltip>
  );
}

export default StatusIndicator;
