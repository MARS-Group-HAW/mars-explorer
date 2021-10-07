import { IModelFile } from "@shared/types/Model";
import {
  openModelDeletion,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import {
  selectDirtyModels,
  selectErrors,
  selectModels,
  selectModelsRead,
} from "../../utils/model-slice";

type State = {
  isLoading: boolean;
  models: IModelFile[];
  isModelInvalid: (model: IModelFile) => boolean;
  isModelSelected: (model: IModelFile) => boolean;
  isModelDirty: (model: IModelFile) => boolean;
  onModelClick: (model: IModelFile) => void;
  onDeleteObjectClick: (model: IModelFile) => void;
};

function useModelList(): State {
  const areModelsReady = useAppSelector(selectModelsRead);
  const models = useAppSelector(selectModels);
  const errorNames = useAppSelector(selectErrors);
  const dirtyNames = useAppSelector(selectDirtyModels);
  const [{ selectedModel }, dispatch] = useSharedModels();

  const onModelClick = (model: IModelFile) => dispatch(selectModel({ model }));

  const onDeleteObjectClick = (model: IModelFile) =>
    dispatch(openModelDeletion({ model }));

  const isModelInvalid = (model: IModelFile) => errorNames.includes(model.name);
  const isModelSelected = (model: IModelFile) => model === selectedModel;
  const isModelDirty = (model: IModelFile) => dirtyNames.includes(model.path);

  return {
    isLoading: !areModelsReady,
    models,
    isModelInvalid,
    isModelSelected,
    isModelDirty,
    onModelClick,
    onDeleteObjectClick,
  };
}

export default useModelList;
