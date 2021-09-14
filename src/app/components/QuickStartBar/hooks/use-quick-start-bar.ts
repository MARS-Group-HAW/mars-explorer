import { selectProject } from "@app/components/Home/utils/project-slice";
import ValidationState from "@app/utils/types/validation-state";
import { useAppSelector } from "../../../utils/hooks/use-store";
import useSimulation from "./use-simulation";

type State = {
  projectName: string;
  modelState: ValidationState;
  configState: ValidationState;
  showStartLoading: boolean;
  showStopLoading: boolean;
  showLoading: boolean;
  disableStart: boolean;
  disableStop: boolean;
  handleStart: () => void;
  handleStop: () => void;
};

function useQuickStartBar(): State {
  const { path, name } = useAppSelector(selectProject);
  const { isRunning, runSimulation } = useSimulation();
  const isStopping = false; // FIXME
  const isProjectDefined = Boolean(path);

  const isModelValid = true; // TODO
  const isConfigValid = true; // TODO

  const determineValidationState = (isValid: boolean): ValidationState => {
    if (!isProjectDefined) return ValidationState.UNKNOWN;

    return isValid ? ValidationState.VALID : ValidationState.INVALID;
  };

  const handleStart = () => runSimulation(path);
  const handleStop = () => window.api.logger.info("Stop pressed");

  const modelState = determineValidationState(isModelValid);
  const configState = determineValidationState(isConfigValid);

  const isAllValid =
    modelState === ValidationState.VALID &&
    configState === ValidationState.VALID &&
    isConfigValid;

  const disableStart = !isAllValid || isRunning;
  const disableStop = !isAllValid || !isRunning;

  return {
    projectName: name || "No project selected",
    modelState,
    configState,
    showStartLoading: isRunning,
    showStopLoading: isStopping,
    showLoading: isRunning || isStopping,
    disableStart,
    disableStop,
    handleStart,
    handleStop,
  };
}

export default useQuickStartBar;
