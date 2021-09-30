import { ModelRef } from "@shared/types/Model";
import { useBoolean, useMount } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectProject,
  setProject as setGlobalProject,
} from "../utils/project-slice";

type State = {
  projects: ModelRef[];
  isModelSelected: (project: ModelRef) => boolean;
  openDialog: boolean;
  handleProjectClick: (project: ModelRef) => void;
  handleNewProjectClick: () => void;
  handleNewProjectClose: () => void;
};

function useHome(): State {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector(selectProject);
  const [modelRefs, setModelRefs] = useState<ModelRef[]>([]);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useBoolean(false);

  const fetchProjects = async () =>
    window.api
      .invoke<void, ModelRef[]>(Channel.GET_USER_PROJECTS)
      .then((refs) => setModelRefs(refs));

  useMount(fetchProjects);

  const isModelSelected = (project: ModelRef) => project.path === path;

  const handleProjectClick = (modelRef: ModelRef) =>
    dispatch(setGlobalProject(modelRef));

  const handleNewProjectClick = () => setNewProjectDialogOpen(true);
  const handleNewProjectClose = () => {
    fetchProjects();
    setNewProjectDialogOpen(false);
  };

  return {
    projects: modelRefs,
    isModelSelected,
    openDialog: newProjectDialogOpen,
    handleProjectClick,
    handleNewProjectClick,
    handleNewProjectClose,
  };
}

export default useHome;
