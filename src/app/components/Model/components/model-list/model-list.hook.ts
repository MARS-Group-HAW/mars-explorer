import { useState } from "react";
import { Channel } from "@shared/types/Channel";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import { useAsync } from "react-use";
import { set } from "@app/components/Model/utils/model-slice";
import { selectProject } from "@app/components/App/utils/project-slice";
import { useAppDispatch, useAppSelector } from "../../../App/hooks/use-store";

type State = {
  models: WorkingModel;
  loading: boolean;
  handleModelClick: (model: IModelFile) => void;
};

function useModelList(): State {
  const dispatch = useAppDispatch();
  const projectRef = useAppSelector(selectProject);
  const [models, setModels] = useState<WorkingModel>([]);

  const { loading } = useAsync(async () => {
    console.log(projectRef);

    if (projectRef) {
      const workingModel = await window.api.invoke<ModelRef, WorkingModel>(
        Channel.GET_USER_PROJECT,
        projectRef
      );
      console.log(workingModel);
      setModels(workingModel);
    }
  }, [projectRef]);

  const handleModelClick = (model: IModelFile) => {
    console.log("Model was clicked: ", model);
    dispatch(set(model));
  };

  return { models, loading, handleModelClick };
}

export default useModelList;
