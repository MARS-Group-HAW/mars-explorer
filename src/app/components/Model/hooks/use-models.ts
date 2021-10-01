import { useState } from "react";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectProject } from "../../Home/utils/project-slice";
import { selectModels, setModel } from "../utils/model-slice";

type State = {
  areModelsLoading: boolean;
  selectedModel: IModelFile;
  setSelectedModel: (model: IModelFile) => void;
  models: WorkingModel;
};

function useModels(): State {
  const dispatch = useAppDispatch();
  const { path, name } = useAppSelector(selectProject);
  const models = useAppSelector(selectModels);

  const [selectedModel, setSelectedModel] = useState<IModelFile>();

  const { loading } = useAsync(async () => {
    if (path) {
      const workingModel = await window.api.invoke<ModelRef, WorkingModel>(
        Channel.GET_USER_PROJECT,
        { path, name }
      );
      dispatch(setModel(workingModel));
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
