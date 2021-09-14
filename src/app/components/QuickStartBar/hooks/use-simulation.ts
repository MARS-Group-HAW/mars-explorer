import { Channel } from "@shared/types/Channel";
import { useEffectOnce } from "react-use";
import { useEffect, useState } from "react";
import { SimulationStates } from "@shared/types/SimulationStates";

type State = {
  simState: SimulationStates;
  runSimulation: (path: string) => void;
  cancelSimulation: () => void;
};

function useSimulation(): State {
  const [simState, setSimState] = useState(SimulationStates.NONE);

  function runSimulation(path: string) {
    setSimState(SimulationStates.RUNNING);
    window.api.send(Channel.RUN_SIMULATION, path);
  }

  function cancelSimulation() {
    window.api.send(Channel.CANCEL_SIMULATION);
  }

  // TODO handle err
  useEffectOnce(() =>
    window.api.on(Channel.SIMULATION_FAILED, () =>
      setSimState(SimulationStates.FAILED)
    )
  );

  useEffectOnce(() =>
    window.api.on<SimulationStates>(Channel.EXITED, setSimState)
  );

  useEffect(() => {
    switch (simState) {
      case SimulationStates.RUNNING:
        window.api.logger.info(`Simulation is running.`);
        break;
      case SimulationStates.SUCCESS:
        window.api.logger.info(`Simulation finished successfully.`);
        break;
      case SimulationStates.CANCELED:
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
    runSimulation,
    cancelSimulation,
  };
}

export default useSimulation;
