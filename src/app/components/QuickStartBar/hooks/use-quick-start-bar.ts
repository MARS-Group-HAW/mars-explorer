import { useAppSelector } from "@app/components/App/hooks/use-store";
import { selectProject } from "@app/components/Home/utils/project-slice";
import ValidationState from "@app/components/QuickStartBar/utils/validation-state";

type State = {
  projectName: string;
  modelState: ValidationState;
  configState: ValidationState;
  areActionsDisabled: boolean;
  handleStart: () => void;
  handleStop: () => void;
};

function useQuickStartBar(): State {
  const { path, name } = useAppSelector(selectProject);

  const isProjectDefined = Boolean(path);

  const isModelValid = true; // TODO
  const isConfigValid = true; // TODO

  const determineValidationState = (isValid: boolean): ValidationState => {
    if (!isProjectDefined) return ValidationState.UNKNOWN;

    return isValid ? ValidationState.VALID : ValidationState.INVALID;
  };

  const handleStart = () => window.api.logger.info("Start pressed");
  const handleStop = () => window.api.logger.info("Stop pressed");

  const modelState = determineValidationState(isModelValid);
  const configState = determineValidationState(isConfigValid);

  const areActionsDisabled = !(
    modelState === ValidationState.VALID &&
    configState === ValidationState.VALID &&
    isConfigValid
  );

  return {
    projectName: name || "No project selected",
    modelState,
    configState,
    areActionsDisabled,
    handleStart,
    handleStop,
  };
}

export default useQuickStartBar;
