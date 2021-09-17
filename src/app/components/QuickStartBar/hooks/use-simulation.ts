import { Channel } from "@shared/types/Channel";
import { useEffectOnce } from "react-use";
import { useEffect, useState } from "react";
import { SimulationStates } from "@shared/types/SimulationStates";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectSimulationState,
  setSimulationState,
} from "../utils/simulation-slice";

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
  const setSimState = (newState: SimulationStates) =>
    dispatch(setSimulationState(newState));

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

  function runSimulation(path: string) {
    setSimState(SimulationStates.STARTED);
    window.api.invoke(Channel.RUN_SIMULATION, path);
  }

  function cancelSimulation() {
    window.api.send(Channel.TERMINATE_SIMULATION);
  }

  useEffectOnce(() =>
    window.api.on<number>(Channel.SIMULATION_PROGRESS, (msg: number) => {
      setSimState(SimulationStates.RUNNING);
      setProgress(msg);
    })
  );

  useEffectOnce(() =>
    window.api.on(Channel.SIMULATION_FAILED, (e: Error) => {
      const errMsg = e.toString();
      window.api.logger.error("Simulation Error: ", errMsg);
      setError(errMsg);
    })
  );

  useEffectOnce(() =>
    window.api.on<SimulationStates>(Channel.EXITED, setSimState)
  );

  useEffect(() => {
    if (simState !== SimulationStates.RUNNING) {
      setProgress(0);
    }

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
