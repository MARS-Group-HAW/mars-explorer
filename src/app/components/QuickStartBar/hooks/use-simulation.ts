import { Channel } from "@shared/types/Channel";
import { useBoolean, useEffectOnce } from "react-use";
import { useEffect } from "react";

type State = {
  isRunning: boolean;
  runSimulation: (path: string) => void;
};

function useSimulation(): State {
  const [isRunning, setIsRunning] = useBoolean(false);

  const resetRunningState = () => setIsRunning(false);

  function runSimulation(path: string) {
    setIsRunning(true);
    window.api.invoke<string, void>(Channel.RUN_SIMULATION, path);
  }

  // TODO handle err
  useEffectOnce(() =>
    window.api.on(Channel.SIMULATION_CANCELED, resetRunningState)
  );

  useEffectOnce(() =>
    window.api.on(Channel.SIMULATION_FINISHED, resetRunningState)
  );

  useEffect(() => {
    if (isRunning) {
      window.api.logger.info(`Simulation started.`);
    } else {
      window.api.logger.info(`Simulation finished.`);
    }
  }, [isRunning]);

  return {
    isRunning,
    runSimulation,
  };
}

export default useSimulation;
