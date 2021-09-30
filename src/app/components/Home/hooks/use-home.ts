import { ModelRef } from "@shared/types/Model";
import { useBoolean, useCustomCompareEffect, useMount } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectProject,
  setProject as setGlobalProject,
} from "../utils/project-slice";

type State = {
  projects: ModelRef[];
  processingModel?: ModelRef;
  isModelSelected: (project: ModelRef) => boolean;
  openCreateDialog: boolean;
  openDeleteDialog: boolean;
  handleProjectClick: (project: ModelRef) => void;
  handleNewProjectClick: () => void;
  handleNewProjectClose: () => void;
  handleDeleteProjectClick: (ref: ModelRef) => void;
  handleDeleteProjectClose: () => void;
};

const didAnyDialogClose = (prev: boolean, next: boolean) => prev && !next;

function useHome(): State {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector(selectProject);
  const [modelRefs, setModelRefs] = useState<ModelRef[]>([]);
  const [modelRef, setModelRef] = useState<ModelRef>();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useBoolean(false);
  const [deleteProjectDialogOpen, setDeleteDialogOpen] = useBoolean(false);

  const fetchProjects = async () =>
    window.api
      .invoke<void, ModelRef[]>(Channel.GET_USER_PROJECTS)
      .then((refs) => setModelRefs(refs));

  useMount(fetchProjects);

  const isModelSelected = (project: ModelRef) => project.path === path;

  const handleProjectClick = (model: ModelRef) =>
    dispatch(setGlobalProject(model));

  const handleNewProjectClick = () => setNewProjectDialogOpen(true);
  const handleNewProjectClose = () => {
    fetchProjects();
    setNewProjectDialogOpen(false);
  };

  const handleDeleteProjectClick = (model: ModelRef) => {
    setModelRef(model);
    setDeleteDialogOpen(true);
  };
  const handleDeleteProjectClose = () => {
    fetchProjects();
    setDeleteDialogOpen(false);
  };

  return {
    projects: modelRefs,
    processingModel: modelRef,
    isModelSelected,
    openCreateDialog: newProjectDialogOpen,
    openDeleteDialog: deleteProjectDialogOpen,
    handleProjectClick,
    handleNewProjectClick,
    handleNewProjectClose,
    handleDeleteProjectClick,
    handleDeleteProjectClose,
  };
}

export default useHome;
