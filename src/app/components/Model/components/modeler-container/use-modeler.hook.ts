import { RefObject, useEffect } from "react";
import { WorkingModel } from "@shared/types/Model";
import useEditor from "../../hooks/use-editor";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import useProjectInitializationStatus from "../../../App/hooks/bootstrap/model/use-project-initialization-status";
import {
  selectLoadingSteps,
  selectModelLoadingProgress,
  selectModels,
  selectStepWithStatus,
} from "../../utils/model-slice";
import LoadingSteps from "../../utils/LoadingSteps";
import { selectModel, useSharedModels } from "../../hooks/use-shared-models";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

type State = {
  stepWithStatus: {
    step: LoadingSteps;
    isLoading: boolean;
  }[];
  showLoading: boolean;
  showModelListLoading: boolean;
  models: WorkingModel;
};

function useModeler({ containerRef }: Props): State {
  const progress = useAppSelector(selectModelLoadingProgress);
  const steps = useAppSelector(selectStepWithStatus);
  const loadingSteps = useAppSelector(selectLoadingSteps);
  const models = useAppSelector(selectModels);
  const [{ selectedModel }, dispatch] = useSharedModels();

  useEditor(containerRef);

  const { isProjectFullyInitialized } = useProjectInitializationStatus();

  // TODO: Temp workaround to validate all files
  useEffect(() => {
    if (!isProjectFullyInitialized || !models) return;

    const currentSelectedModel = selectedModel;

    // set every model in editor to enable validation of each
    models.forEach((model) => dispatch(selectModel({ model })));
    // reset to last state
    dispatch(selectModel({ model: currentSelectedModel }));
  }, [isProjectFullyInitialized, models]);

  return {
    models,
    stepWithStatus: steps,
    showLoading: progress < 100,
    showModelListLoading: !loadingSteps.includes(LoadingSteps.MODELS_READ),
  };
}

export default useModeler;
