import { Channel } from "@shared/types/Channel";
import { useEffect, useState } from "react";
import { SimulationStates } from "@shared/types/SimulationStates";
import {
  SimulationCountMessage,
  SimulationVisMessage,
  SimulationWorldSizeMessage,
} from "@shared/types/SimulationMessages";
import { useLatest } from "react-use";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  addCountData,
  addPosData,
  finishResults,
  selectSimulationState,
  setSimulationState,
  setWorldSizes,
} from "../utils/simulation-slice";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";

type State = {
  simState: SimulationStates;
  progress: number;
  outputMsg: string;
  errorMsg: string;
  runSimulation: (path: string) => void;
  cancelSimulation: () => void;
};

function useSimulation(): State {
  const dispatch = useAppDispatch();
  const simState = useAppSelector(selectSimulationState);
  const dispatchSimState = (newState: SimulationStates) =>
    dispatch(setSimulationState(newState));

  const [progress, setProgress] = useState(0);
  const latestProgress = useLatest(progress);
  const [output, setOutput] = useState<string>();
  const [error, setError] = useState<string>();

  function runSimulation(path: string) {
    dispatchSimState(SimulationStates.STARTED);
    setProgress(0);
    window.api.send(Channel.RUN_SIMULATION, path);
  }

  function cancelSimulation() {
    window.api.send(Channel.TERMINATE_SIMULATION);
  }

  const handleSimulationProgress = (newProgress: number) => {
    dispatchSimState(SimulationStates.RUNNING);
    setProgress(Math.max(latestProgress.current, newProgress));
  };

  function handleSimulationCountMsg(msg: SimulationCountMessage) {
    handleSimulationProgress(msg.progress);
    dispatch(addCountData(msg));
  }

  function handleSimulationCoordsMsg(msg: SimulationVisMessage) {
    handleSimulationProgress(msg.progress);
    dispatch(addPosData(msg));
  }

  function handleWorldSizeMsg(msg: SimulationWorldSizeMessage) {
    dispatch(setWorldSizes(msg));
  }

  function handleSimulationEnd(endState: SimulationStates) {
    dispatchSimState(endState);
    window.api.logger.info(`Finishing results (Code: ${endState}).`);

    if (endState === SimulationStates.SUCCESS) {
      dispatch(finishResults());
    }
  }

  function handleSimulationOutput(simOutput: string) {
    setOutput(simOutput);
  }

  useChannelSubscription(
    Channel.SIMULATION_COORDS_PROGRESS,
    handleSimulationCoordsMsg
  );

  useChannelSubscription(
    Channel.SIMULATION_COUNT_PROGRESS,
    handleSimulationCountMsg
  );

  useChannelSubscription(Channel.SIMULATION_WORLD_SIZES, handleWorldSizeMsg);

  useChannelSubscription(Channel.SIMULATION_FAILED, (e: Error | string) => {
    const errMsg = e instanceof String ? (e as string) : e.toString();
    window.api.logger.error("Simulation Error: ", errMsg);
    setError(errMsg);
  });

  useChannelSubscription(Channel.SIMULATION_OUTPUT, handleSimulationOutput);

  useChannelSubscription(Channel.SIMULATION_EXITED, handleSimulationEnd);

  useEffect(() => {
    if (simState !== SimulationStates.FAILED) {
      setError(undefined);
    }

    switch (simState) {
      case SimulationStates.STARTED:
        window.api.logger.info(`Simulation started.`);
        break;
      case SimulationStates.RUNNING:
        window.api.logger.info(`Simulation is running.`);
        break;
      case SimulationStates.SUCCESS:
        window.api.logger.info(`Simulation finished successfully.`);
        break;
      case SimulationStates.TERMINATED:
        window.api.logger.info(`Simulation canceled by user.`);
        break;
      case SimulationStates.FAILED:
        window.api.logger.info(`Simulation errored.`);
        break;
      case SimulationStates.PAUSED:
        window.api.logger.info(`Simulation was paused.`);
        break;
      case SimulationStates.NONE:
        window.api.logger.info("No recent sim state.");
        break;
      case SimulationStates.UNKNOWN:
      default:
        window.api.logger.warn(`Unknown state.`);
        break;
    }
  }, [simState]);

  return {
    simState,
    progress,
    outputMsg: output,
    errorMsg: error,
    runSimulation,
    cancelSimulation,
  };
}

export default useSimulation;
