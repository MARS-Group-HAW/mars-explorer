import { useContext, useState } from "react";
import { Channel } from "@shared/types/Channel";
import { ObjectCreationMessage } from "@shared/types/object-creation-message";
import SimObjects from "@shared/types/sim-objects";
import { useBoolean } from "react-use";
import { IModelFile } from "@shared/types/Model";
import { SnackBarContext } from "../../../shared/snackbar/snackbar-provider";
import useCapitalizedValue from "../../../../utils/hooks/use-capitalized-value";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../utils/hooks/use-store";
import { selectProject } from "../../../Home/utils/project-slice";
import { addModel } from "../../utils/model-slice";

type State = {
  disableConfirmButton: boolean;
  loadConfirmButton: boolean;
  newObjectName: string;
  setNewObjectName: (value: string) => void;
  selectedObject: SimObjects;
  onObjectTypeClick: (objectType: SimObjects) => void;
  onNewObjectDialogClose: () => void;
  onNewObjectDialogConfirm: () => void;
};

function useNewObjectDialog(onClose: () => void): State {
  const { path, name } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [newObjectName, setNewObjectName] = useCapitalizedValue();
  const [selectedObject, setSelectedObject] = useState<SimObjects>();

  const onNewObjectDialogClose = () => {
    setNewObjectName("");
    onClose();
  };

  const onNewObjectDialogConfirm = () => {
    setIsLoading(true);

    window.api
      .invoke<ObjectCreationMessage, IModelFile>(Channel.CREATE_OBJECT, {
        projectPath: path,
        projectName: name,
        objectType: selectedObject,
        objectName: newObjectName,
      })
      .then((model) => {
        addSuccessAlert({ msg: `Object "${newObjectName}" has been created.` });
        dispatch(addModel(model));
      })
      .catch((e: unknown) =>
        addErrorAlert({
          msg: `An error occurred while creating Object "${newObjectName}": ${e}`,
        })
      )
      .finally(() => {
        onNewObjectDialogClose();
        setIsLoading(false);
      });
  };

  return {
    disableConfirmButton:
      newObjectName.length === 0 || !selectedObject || isLoading,
    loadConfirmButton: isLoading,
    newObjectName,
    setNewObjectName,
    selectedObject,
    onObjectTypeClick: setSelectedObject,
    onNewObjectDialogClose,
    onNewObjectDialogConfirm,
  };
}

export default useNewObjectDialog;
