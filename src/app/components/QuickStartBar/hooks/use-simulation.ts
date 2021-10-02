import { Channel } from "@shared/types/Channel";
import { useEffect, useState } from "react";
import { SimulationStates } from "@shared/types/SimulationStates";
import { SimulationProgressMessage } from "@shared/types/SimulationMessages";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  addResults,
  finishResults,
  selectSimulationState,
  setSimulationState,
} from "../utils/simulation-slice";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";

type State = {
  simState: SimulationStates;
  progress: number;
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
  const [error, setError] = useState<string>();

  function runSimulation(path: string) {
    dispatchSimState(SimulationStates.STARTED);
    window.api.invoke(Channel.RUN_SIMULATION, path);
  }

  function cancelSimulation() {
    window.api.send(Channel.TERMINATE_SIMULATION);
  }

  function handleSimulationProgress({
    progress: simProgress,
    results,
  }: SimulationProgressMessage) {
    dispatchSimState(SimulationStates.RUNNING);
    setProgress(simProgress);
    results.forEach(({ name, count, coords }) => {
      dispatch(addResults({ name, data: { count, coords } }));
    });
  }

  function handleSimulationEnd(endState: SimulationStates) {
    dispatchSimState(endState);
    window.api.logger.info(`Finishing results (Code: ${endState}).`);

    if (endState === SimulationStates.SUCCESS) {
      console.log("with success");
      try {
        dispatch(finishResults());
      } catch (e: unknown) {
        if (e === "QUOTA_EXCEEDED_ERR") {
          // TODO
          alert(
            "The result could no be saved because it was too large. The results will not be available after a restart."
          ); // data wasn't successfully saved due to quota exceed so throw an error
        }
      }
    }
  }

  useChannelSubscription(Channel.SIMULATION_PROGRESS, handleSimulationProgress);

  useChannelSubscription(Channel.SIMULATION_FAILED, (e: Error) => {
    const errMsg = e.toString();
    window.api.logger.error("Simulation Error: ", errMsg);
    setError(errMsg);
  });

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
    errorMsg: error,
    runSimulation,
    cancelSimulation,
  };
}

export default useSimulation;
