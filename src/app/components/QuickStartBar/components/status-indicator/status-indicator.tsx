import * as React from "react";
import { SimulationStates } from "@shared/types/SimulationStates";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorIcon from "@material-ui/icons/Error";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PanToolIcon from "@material-ui/icons/PanTool";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Tooltip } from "@material-ui/core";
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
      return "Simulation has finished.";
    case SimulationStates.FAILED:
      return "Simulation has failed. Click to show the error message.";
    case SimulationStates.PAUSED:
      return "Simulation has been paused.";
    case SimulationStates.TERMINATED:
      return "You've terminated the simulation.";
    case SimulationStates.NONE:
      return "Waiting for action.";
    case SimulationStates.UNKNOWN:
    default:
      return "Unknown status";
  }
}

function StatusIndicator({ showProgress, progress, simState }: Props) {
  if (showProgress) {
    return (
      <CircularProgressWithLabel
        hasStarted={simState === SimulationStates.RUNNING}
        value={progress}
      />
    );
  }

  return (
    <Tooltip arrow title={getLabelBySimState(simState)}>
      {getIconBySimState(simState)}
    </Tooltip>
  );
}

export default StatusIndicator;
