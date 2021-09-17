import { selectProject } from "@app/components/Home/utils/project-slice";
import ValidationState from "@app/utils/types/validation-state";
import { SimulationStates } from "@shared/types/SimulationStates";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../utils/hooks/use-store";
import useSimulation from "./use-simulation";
import { selectModel } from "../../Model/utils/model-slice";
import useProjectInitializationStatus from "../../App/hooks/bootstrap/model/use-project-initialization-status";

type State = {
  projectName: string;
  simState: SimulationStates;
  progress: number;
  showProgress: boolean;
  modelState: ValidationState;
  modelErrorFiles?: string[];
  configState: ValidationState;
  disableStart: boolean;
  disableStop: boolean;
  handleStart: () => void;
  handleStop: () => void;
};

function useQuickStartBar(): State {
  const { isProjectFullyInitialized } = useProjectInitializationStatus();
  const { path, name } = useAppSelector(selectProject);
  const { simState, progress, runSimulation, cancelSimulation } =
    useSimulation();

  const isProjectDefined = Boolean(path);

  const { hasErrorsIn } = useAppSelector(selectModel);

  const [modelValidationState, setModelValidationState] = useState(
    ValidationState.UNKNOWN
  );

  const [configValidationState, setConfigValidationState] = useState(
    ValidationState.UNKNOWN
  );

  const handleValidation = (
    setStateFn: (valState: ValidationState) => void,
    hasErrors: boolean
  ) => {
    if (!isProjectDefined) {
      setStateFn(ValidationState.UNKNOWN);
    } else if (!isProjectFullyInitialized) {
      setStateFn(ValidationState.LOADING);
    } else if (hasErrors) {
      setStateFn(ValidationState.INVALID);
    } else {
      setStateFn(ValidationState.VALID);
    }
  };

  useEffect(() => {
    handleValidation(setModelValidationState, hasErrorsIn.length > 0);
    handleValidation(setConfigValidationState, false);
  }, [path, hasErrorsIn, isProjectFullyInitialized]);

  const handleStart = () => runSimulation(path);
  const handleStop = () => cancelSimulation();

  const isAllValid =
    modelValidationState === ValidationState.VALID &&
    configValidationState === ValidationState.VALID;

  const isRunning =
    simState === SimulationStates.RUNNING ||
    simState === SimulationStates.STARTED;
  const disableStart = !isAllValid || isRunning;
  const disableStop = !isAllValid || !isRunning;

  return {
    projectName: name || "No project selected",
    modelState: modelValidationState,
    configState: configValidationState,
    simState,
    progress,
    showProgress: isRunning,
    modelErrorFiles:
      modelValidationState === ValidationState.INVALID && hasErrorsIn,
    disableStart,
    disableStop,
    handleStart,
    handleStop,
  };
}

export default useQuickStartBar;
