import { selectProject } from "@app/components/Home/utils/project-slice";
import ValidationState from "@app/utils/types/validation-state";
import { SimulationStates } from "@shared/types/SimulationStates";
import { useEffect, useState } from "react";
import { useBoolean } from "react-use";
import { useAppSelector } from "../../../utils/hooks/use-store";
import useSimulation from "./use-simulation";
import {
  selectDirtyModels,
  selectErrors,
  selectModelFullyInitialized,
} from "../../Model/utils/model-slice";
import useResultsInLocalStorage from "./use-results-in-local-storage";
import {
  selectConfigErrors,
  selectConfigStatus,
} from "../../Configure/utils/config-slice";

type State = {
  projectName: string;
  simState: SimulationStates;
  progress: number;
  showProgress: boolean;
  showErrorDialog: boolean;
  openErrorDialog: () => void;
  closeErrorDialog: () => void;
  errorMsg: string;
  modelState: ValidationState;
  modelErrorFiles?: string[];
  configErrors: string[];
  configState: ValidationState;
  disableStart: boolean;
  disableStop: boolean;
  handleStart: () => void;
  handleStop: () => void;
};

function useQuickStartBar(): State {
  const isProjectFullyInitialized = useAppSelector(selectModelFullyInitialized);
  const { path, name } = useAppSelector(selectProject);
  useResultsInLocalStorage();
  const { simState, progress, errorMsg, runSimulation, cancelSimulation } =
    useSimulation();

  const isProjectDefined = Boolean(path);

  const modelErrors = useAppSelector(selectErrors);
  const modelDirtyFiles = useAppSelector(selectDirtyModels);

  const configErrors = useAppSelector(selectConfigErrors);
  const configStatus = useAppSelector(selectConfigStatus);

  const [showErrorDialog, setShowErrorDialog] = useBoolean(false);

  const [modelValidationState, setModelValidationState] = useState(
    ValidationState.UNKNOWN
  );

  const handleValidation = (
    setStateFn: (valState: ValidationState) => void,
    hasErrors: boolean,
    hasDirtyFiles: boolean
  ) => {
    if (!isProjectDefined) {
      setStateFn(ValidationState.UNKNOWN);
    } else if (!isProjectFullyInitialized) {
      setStateFn(ValidationState.LOADING);
    } else if (hasDirtyFiles) {
      setStateFn(ValidationState.DIRTY);
    } else if (hasErrors) {
      setStateFn(ValidationState.INVALID);
    } else {
      setStateFn(ValidationState.VALID);
    }
  };

  useEffect(() => {
    handleValidation(
      setModelValidationState,
      modelErrors.length > 0,
      modelDirtyFiles.length > 0
    );
  }, [path, modelErrors, modelDirtyFiles, isProjectFullyInitialized]);

  useEffect(() => {
    setShowErrorDialog(Boolean(errorMsg));
  }, [errorMsg]);

  const handleStart = () => runSimulation(path);
  const handleStop = () => cancelSimulation();

  const isAllValid =
    modelValidationState === ValidationState.VALID &&
    configStatus === ValidationState.VALID;

  const isRunning =
    simState === SimulationStates.RUNNING ||
    simState === SimulationStates.STARTED;
  const disableStart = !isAllValid || isRunning;
  const disableStop = !isAllValid || !isRunning;

  return {
    projectName: name || "No project selected",
    modelState: modelValidationState,
    configState: configStatus,
    simState,
    progress,
    showProgress: isRunning,
    errorMsg,
    showErrorDialog,
    openErrorDialog: () => setShowErrorDialog(true),
    closeErrorDialog: () => setShowErrorDialog(false),
    modelErrorFiles: modelErrors || [],
    configErrors,
    disableStart,
    disableStop,
    handleStart,
    handleStop,
  };
}

export default useQuickStartBar;
