import { useBoolean } from "react-use";
import { IModelFile } from "@shared/types/Model";
import {
  openModelCreation,
  openModelDeletion,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";

type State = {
  selectedModel: IModelFile;
  isProjectView: boolean;
  isExampleView: boolean;
  showAddButton: boolean;
  onModelClick: (model: IModelFile) => void;
  onMyProjectButtonClick: () => void;
  onExamplesButtonClick: () => void;
  onDeleteObjectClick: (model: IModelFile) => void;
  onAddButtonClick: () => void;
};

function useModelList(): State {
  const [{ selectedModel }, dispatch] = useSharedModels();

  const [isProjectView, setProjectView] = useBoolean(true);

  const onAddButtonClick = () => dispatch(openModelCreation());

  const onModelClick = (model: IModelFile) => dispatch(selectModel({ model }));

  const onDeleteObjectClick = (model: IModelFile) =>
    dispatch(openModelDeletion({ model }));

  return {
    selectedModel,
    isProjectView,
    isExampleView: !isProjectView,
    showAddButton: isProjectView,
    onModelClick,
    onMyProjectButtonClick: () => setProjectView(true),
    onExamplesButtonClick: () => setProjectView(false),
    onDeleteObjectClick,
    onAddButtonClick,
  };
}

export default useModelList;
