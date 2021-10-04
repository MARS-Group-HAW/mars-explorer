import { useBoolean } from "react-use";
import { IModelFile } from "@shared/types/Model";
import {
  openModelCreation,
  openModelDeletion,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectErrors } from "../../utils/model-slice";

type State = {
  isProjectView: boolean;
  isExampleView: boolean;
  showAddButton: boolean;
  isModelInvalid: (model: IModelFile) => boolean;
  isModelSelected: (model: IModelFile) => boolean;
  onModelClick: (model: IModelFile) => void;
  onMyProjectButtonClick: () => void;
  onExamplesButtonClick: () => void;
  onDeleteObjectClick: (model: IModelFile) => void;
  onAddButtonClick: () => void;
};

function useModelList(): State {
  const errorNames = useAppSelector(selectErrors);
  const [{ selectedModel }, dispatch] = useSharedModels();

  const [isProjectView, setProjectView] = useBoolean(true);

  const onAddButtonClick = () => dispatch(openModelCreation());

  const onModelClick = (model: IModelFile) => dispatch(selectModel({ model }));

  const onDeleteObjectClick = (model: IModelFile) =>
    dispatch(openModelDeletion({ model }));

  const isModelInvalid = (model: IModelFile) => errorNames.includes(model.name);
  const isModelSelected = (model: IModelFile) => model === selectedModel;

  return {
    isProjectView,
    isExampleView: !isProjectView,
    isModelInvalid,
    isModelSelected,
    showAddButton: isProjectView,
    onModelClick,
    onMyProjectButtonClick: () => setProjectView(true),
    onExamplesButtonClick: () => setProjectView(false),
    onDeleteObjectClick,
    onAddButtonClick,
  };
}

export default useModelList;
