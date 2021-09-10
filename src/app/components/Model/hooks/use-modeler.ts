import { RefObject, useEffect, useState } from "react";
import { WorkingModel } from "@shared/types/Model";
import useEditor from "./use-editor";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectProgress } from "../../Home/utils/project-slice";
import useModels from "./use-models";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

type State = {
  progress: number;
  loadingMsg: string;
  showLoading: boolean;
  showModelListLoading: boolean;
  models: WorkingModel;
  selectedModelIndex: number;
  selectModelAtIndex: (index: number) => void;
};

/*
const EDITOR_LOADING_MSG = "Starting Language Server ...";
const INSTALLING_MSG = "Installing dependencies ...";
const BOTH_MSG = `${EDITOR_LOADING_MSG} & ${INSTALLING_MSG}`;
 */

function useModeler({ containerRef }: Props): State {
  const progress = useAppSelector(selectProgress);

  const [selectedModelIndex, selectModelAtIndex] = useState<number>(0);

  const { models, areModelsLoading } = useModels();

  const { setModel: setModelInMonacoEditor } = useEditor(containerRef);

  useEffect(() => {
    if (areModelsLoading) return;

    const selectedModel = models[selectedModelIndex];

    if (!selectedModel) {
      window.api.logger.warn("Tried to access a model at an invalid index.");
      return;
    }

    const { path, content } = selectedModel;

    setModelInMonacoEditor(path, content);
  }, [selectedModelIndex, areModelsLoading]);

  return {
    progress,
    loadingMsg: `Loading ...`,
    showLoading: progress < 100,
    showModelListLoading: areModelsLoading,
    models,
    selectedModelIndex,
    selectModelAtIndex,
  };
}

export default useModeler;
