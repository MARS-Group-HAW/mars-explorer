import { useState } from "react";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectProject } from "../../Home/utils/project-slice";

type State = {
  areModelsLoading: boolean;
  selectedModel: IModelFile;
  setSelectedModel: (model: IModelFile) => void;
  models: WorkingModel;
};

function useModels(): State {
  const { path, name } = useAppSelector(selectProject);

  const [selectedModel, setSelectedModel] = useState<IModelFile>();
  const [models, setModels] = useState<WorkingModel>([]);

  const { loading } = useAsync(async () => {
    if (path) {
      const workingModel = await window.api.invoke<ModelRef, WorkingModel>(
        Channel.GET_USER_PROJECT,
        { path, name }
      );
      setModels(workingModel);
    }
  }, [path]);

  return {
    areModelsLoading: loading,
    selectedModel,
    models,
    setSelectedModel,
  };
}

export default useModels;
