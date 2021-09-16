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

  useEffect(() => {
    if (!isProjectFullyInitialized) {
      setModelValidationState(ValidationState.UNKNOWN);
      return;
    }

    if (hasErrorsIn.length === 0) {
      setModelValidationState(ValidationState.VALID);
    } else {
      setModelValidationState(ValidationState.INVALID);
    }
  }, [hasErrorsIn, isProjectFullyInitialized]);

  const isConfigValid = true; // TODO

  const determineValidationState = (isValid: boolean): ValidationState => {
    if (!isProjectDefined) return ValidationState.UNKNOWN;

    return isValid ? ValidationState.VALID : ValidationState.INVALID;
  };

  const handleStart = () => runSimulation(path);
  const handleStop = () => cancelSimulation();

  const configState = determineValidationState(isConfigValid);

  const isAllValid =
    modelValidationState === ValidationState.VALID &&
    configState === ValidationState.VALID &&
    isConfigValid;

  const isRunning = simState === SimulationStates.RUNNING;
  const disableStart = !isAllValid || isRunning;
  const disableStop = !isAllValid || !isRunning;

  return {
    projectName: name || "No project selected",
    modelState: modelValidationState,
    progress,
    showProgress:
      simState === SimulationStates.STARTED ||
      simState === SimulationStates.RUNNING,
    modelErrorFiles:
      modelValidationState === ValidationState.INVALID && hasErrorsIn,
    configState,
    simState,
    disableStart,
    disableStop,
    handleStart,
    handleStop,
  };
}

export default useQuickStartBar;
