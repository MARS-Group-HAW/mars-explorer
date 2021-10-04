import { useBoolean } from "react-use";
import { useState } from "react";
import { IModelFile } from "@shared/types/Model";
import useDialog from "../../../../utils/hooks/use-dialog";

type State = {
  isProjectView: boolean;
  isExampleView: boolean;
  showAddButton: boolean;
  onMyProjectButtonClick: () => void;
  onExamplesButtonClick: () => void;
  objectToDelete?: IModelFile;
  onDeleteObjectClick: (model: IModelFile) => void;
  onAddButtonClick: () => void;
  isNewObjectDialogOpen: boolean;
  onNewObjectDialogClose: () => void;
  isDeleteObjectDialogOpen: boolean;
  onDeleteObjectDialogClose: () => void;
};

function useModelList(): State {
  const [isProjectView, setProjectView] = useBoolean(true);
  const [processingObj, setProcessingObj] = useState<IModelFile>();
  const {
    open: isNewObjectDialogOpen,
    openDialog: openNewObjectDialog,
    closeDialog: closeNewObjectDialog,
  } = useDialog();

  const {
    open: isDeleteObjectDialogOpen,
    openDialog: openDeleteObjectDialog,
    closeDialog: closeDeleteObjectDialog,
  } = useDialog();

  const onDeleteObjectClick = (model: IModelFile) => {
    setProcessingObj(model);
    openDeleteObjectDialog();
  };

  const onDeleteObjectDialogClose = () => {
    setProcessingObj(undefined);
    closeDeleteObjectDialog();
  };

  return {
    objectToDelete: processingObj,
    isProjectView,
    isExampleView: !isProjectView,
    showAddButton: isProjectView,
    onMyProjectButtonClick: () => setProjectView(true),
    onExamplesButtonClick: () => setProjectView(false),
    onDeleteObjectClick,
    onAddButtonClick: openNewObjectDialog,
    isNewObjectDialogOpen,
    onNewObjectDialogClose: closeNewObjectDialog,
    isDeleteObjectDialogOpen,
    onDeleteObjectDialogClose,
  };
}

export default useModelList;
