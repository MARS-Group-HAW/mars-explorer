import { useContext, useEffect, useState } from "react";
import { Channel } from "@shared/types/Channel";
import SimTypes from "@shared/types/sim-objects";
import SimObjects from "@shared/types/sim-objects";
import { useBoolean } from "react-use";
import {
  AgentClassCreationMessage,
  ClassCreationMessage,
  DependentLayerClassCreationMessage,
} from "@shared/types/class-creation-message";
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
  newClassName: string;
  setNewClassName: (value: string) => void;
  dependentLayerClassName: string;
  setDependentLayerClassName: (value: string) => void;
  layerClassName: string;
  setLayerClassName: (value: string) => void;
  selectedType: SimTypes;
  onTypeClick: (type: SimTypes) => void;
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
  const [newClassName, setNewClassName] = useCapitalizedValue("");
  const [dependentLayerClassName, setDependentLayerClassName] =
    useCapitalizedValue("");
  const [layerClassName, setLayerClassName] = useCapitalizedValue("");
  const [selectedType, setSelectedType] = useState<SimTypes>();
  const [disable, setDisable] = useBoolean(false);

  useEffect(() => {
    if (newClassName.length === 0 || !selectedType || isLoading) {
      setDisable(true);
      return;
    }

    const isUnique =
      !models ||
      !models.map((model) => model.name.split(".")[0]).includes(newClassName);

    if (!isUnique) {
      setDisable(true);
      return;
    }

    setDisable(false);
  }, [newClassName, selectedType, isLoading, models]);

  const onDialogClose = () => {
    setNewClassName("");
    sharedModelDispatch(closeModelCreation);
  };

  const onDialogConfirm = () => {
    setIsLoading(true);

    const genericCreationMsg: ClassCreationMessage = {
      projectPath: path,
      projectName: name,
      type: selectedType,
      className: newClassName,
    };

    if (selectedType === SimObjects.AGENT) {
      (genericCreationMsg as AgentClassCreationMessage).layerClassName =
        layerClassName;
    }

    if (selectedType === SimObjects.DEPENDENT_LAYER) {
      (
        genericCreationMsg as DependentLayerClassCreationMessage
      ).dependentLayerName = dependentLayerClassName;
    }

    window.api
      .invoke(Channel.CREATE_CLASS, genericCreationMsg)
      .then((model) => {
        addSuccessAlert({ msg: `Class "${newClassName}" has been created.` });
        dispatch(addModel(model));
        sharedModelDispatch(selectModel({ model }));
      })
      .catch((e: unknown) =>
        addErrorAlert({
          msg: `An error occurred while creating Class "${newClassName}": ${e}`,
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
    newClassName,
    setNewClassName,
    dependentLayerClassName,
    setDependentLayerClassName,
    layerClassName,
    setLayerClassName,
    selectedType,
    onTypeClick: setSelectedType,
    isOpen: isCreateDialogOpen,
    onDialogClose,
    onDialogConfirm,
  };
}

export default useNewObjectDialog;
