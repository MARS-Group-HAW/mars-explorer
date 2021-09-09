import { useState } from "react";
import { Channel } from "@shared/types/Channel";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import { useAsync } from "react-use";
import { set } from "@app/components/Model/utils/model-slice";
import { selectProject } from "@app/components/Home/utils/project-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utils/hooks/use-store";

type State = {
  models: WorkingModel;
  selectedModel: IModelFile;
  showLoading: boolean;
  showEmptyModels: boolean;
  handleModelClick: (model: IModelFile) => void;
};

function useModelList(): State {
  const dispatch = useAppDispatch();
  const { path, name } = useAppSelector(selectProject);
  const [selectedModel, setSelectedModel] = useState<IModelFile>(null);
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

  const handleModelClick = (model: IModelFile) => {
    setSelectedModel(model);
    dispatch(set(model));
  };

  return {
    selectedModel,
    models,
    showLoading: loading,
    showEmptyModels: models.length === 0,
    handleModelClick,
  };
}

export default useModelList;
