import { useBoolean } from "react-use";
import useDialog from "../../../../utils/hooks/use-dialog";

type State = {
  isProjectView: boolean;
  isExampleView: boolean;
  showAddButton: boolean;
  onMyProjectButtonClick: () => void;
  onExamplesButtonClick: () => void;
  onAddButtonClick: () => void;
  isNewObjectDialogOpen: boolean;
  onNewObjectDialogClose: () => void;
};

function useModelList(): State {
  const [isProjectView, setProjectView] = useBoolean(true);
  const { open, openDialog, closeDialog } = useDialog();

  return {
    isProjectView,
    isExampleView: !isProjectView,
    showAddButton: isProjectView,
    onMyProjectButtonClick: () => setProjectView(true),
    onExamplesButtonClick: () => setProjectView(false),
    onAddButtonClick: openDialog,
    isNewObjectDialogOpen: open,
    onNewObjectDialogClose: closeDialog,
  };
}

export default useModelList;
