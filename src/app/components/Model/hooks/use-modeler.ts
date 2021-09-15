import { RefObject, useEffect, useState } from "react";
import { WorkingModel } from "@shared/types/Model";
import useEditor from "./use-editor";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectProgress } from "../../Home/utils/project-slice";
import useModels from "./use-models";
import useProjectInitializationStatus from "../../App/hooks/use-project-initialization-status";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

type State = {
  loadingMsg: string;
  showLoading: boolean;
  showModelListLoading: boolean;
  models: WorkingModel;
  selectedModelIndex: number;
  selectModelAtIndex: (index: number) => void;
};

function useModeler({ containerRef }: Props): State {
  const progress = useAppSelector(selectProgress);

  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);

  const { models, areModelsLoading } = useModels();

  const { setModel: setModelInMonacoEditor } = useEditor(containerRef);

  function selectModelAtIndex(index: number) {
    const selectedModel = models[index];

    if (!selectedModel) {
      window.api.logger.warn("Tried to access a model at an invalid index.");
      return;
    }

    const { path, content } = selectedModel;

    setModelInMonacoEditor(path, content);
  }

  useEffect(() => {
    if (areModelsLoading) return;
    selectModelAtIndex(selectedModelIndex);
  }, [selectedModelIndex, areModelsLoading]);

  const { isProjectFullyInitialized } = useProjectInitializationStatus();

  // TODO: Temp workaround to validate all files
  useEffect(() => {
    if (!isProjectFullyInitialized || !models) return;

    // set every model in editor to enable validation of each
    models.forEach((_, index) => selectModelAtIndex(index));
    // reset to last state
    selectModelAtIndex(selectedModelIndex);
  }, [isProjectFullyInitialized, models]);

  return {
    loadingMsg: `Loading ... (${progress}%)`,
    showLoading: progress < 100,
    showModelListLoading: areModelsLoading,
    models,
    selectedModelIndex,
    selectModelAtIndex: setSelectedModelIndex,
  };
}

export default useModeler;
