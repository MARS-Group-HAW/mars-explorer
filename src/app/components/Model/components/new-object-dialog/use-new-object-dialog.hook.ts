import { useContext, useEffect, useState } from "react";
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
import { addModel, selectModels } from "../../utils/model-slice";
import {
  closeModelCreation,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";

type State = {
  disableConfirmButton: boolean;
  loadConfirmButton: boolean;
  newObjectName: string;
  setNewObjectName: (value: string) => void;
  selectedObject: SimObjects;
  onObjectTypeClick: (objectType: SimObjects) => void;
  isOpen: boolean;
  onDialogClose: () => void;
  onDialogConfirm: () => void;
};

function useNewObjectDialog(): State {
  const models = useAppSelector(selectModels);
  const { path, name } = useAppSelector(selectProject);
  const [{ isCreateDialogOpen }, sharedModelDispatch] = useSharedModels();
  const dispatch = useAppDispatch();
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [newObjectName, setNewObjectName] = useCapitalizedValue("");
  const [selectedObject, setSelectedObject] = useState<SimObjects>();
  const [disable, setDisable] = useBoolean(false);

  useEffect(() => {
    if (newObjectName.length === 0 || !selectedObject || isLoading) {
      setDisable(true);
      return;
    }

    const isUnique =
      !models ||
      !models.map((model) => model.name.split(".")[0]).includes(newObjectName);

    if (!isUnique) {
      setDisable(true);
      return;
    }

    setDisable(false);
  }, [newObjectName, selectedObject, isLoading, models]);

  const onDialogClose = () => {
    setNewObjectName("");
    sharedModelDispatch(closeModelCreation);
  };

  const onDialogConfirm = () => {
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
        sharedModelDispatch(selectModel({ model }));
      })
      .catch((e: unknown) =>
        addErrorAlert({
          msg: `An error occurred while creating Object "${newObjectName}": ${e}`,
        })
      )
      .finally(() => {
        onDialogClose();
        setIsLoading(false);
      });
  };

  return {
    disableConfirmButton: disable,
    loadConfirmButton: isLoading,
    newObjectName,
    setNewObjectName,
    selectedObject,
    onObjectTypeClick: setSelectedObject,
    isOpen: isCreateDialogOpen,
    onDialogClose,
    onDialogConfirm,
  };
}

export default useNewObjectDialog;
