import { ModelRef } from "@shared/types/Model";
import { useBoolean } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectProject,
  setProject as setGlobalProject,
} from "../utils/project-slice";
import useProjects from "./use-projects";
import { resetStore } from "../../../utils/store";

export enum HomeTab {
  MY_PROJECTS,
  EXAMPLES,
}

type State = {
  tab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
  projects: ModelRef[];
  processingModel?: ModelRef;
  isModelSelected: (project: ModelRef) => boolean;
  openCreateDialog: boolean;
  openDeleteDialog: boolean;
  openCopyDialog: boolean;
  handleProjectClick: (project: ModelRef) => void;
  handleExampleProjectClick: (project: ModelRef) => void;
  handleNewProjectClick: () => void;
  handleNewProjectClose: () => void;
  handleDeleteProjectClick: (ref: ModelRef) => void;
  handleDeleteProjectClose: () => void;
  handleCopyProjectClose: () => void;
};

function useHome(): State {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector(selectProject);

  const { projects: userProjects, fetchProjects } = useProjects(
    Channel.GET_USER_PROJECTS
  );
  const { projects: exampleProjects } = useProjects(
    Channel.GET_EXAMPLE_PROJECTS
  );

  const [modelRef, setModelRef] = useState<ModelRef>();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useBoolean(false);
  const [deleteProjectDialogOpen, setDeleteDialogOpen] = useBoolean(false);
  const [copyProjectDialogOpen, setCopyProjectDialogOpen] = useBoolean(false);

  const [tab, setTab] = useState(HomeTab.MY_PROJECTS);

  const isModelSelected = (project: ModelRef) => project.path === path;

  const handleProjectClick = (model: ModelRef) => {
    dispatch(resetStore());
    dispatch(setGlobalProject(model));
  };

  const handleCopyClick = (model: ModelRef) => {
    setModelRef(model);
    setCopyProjectDialogOpen(true);
  };
  const handleCopyProjectClose = () => {
    setCopyProjectDialogOpen(false);
    fetchProjects();
  };

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

  const isMyProjectsTab = tab === HomeTab.MY_PROJECTS;

  return {
    tab,
    onTabChange: setTab,
    projects: isMyProjectsTab ? userProjects : exampleProjects,
    processingModel: modelRef,
    isModelSelected,
    openCreateDialog: newProjectDialogOpen,
    openDeleteDialog: deleteProjectDialogOpen,
    openCopyDialog: copyProjectDialogOpen,
    handleProjectClick,
    handleExampleProjectClick: handleCopyClick,
    handleNewProjectClick,
    handleNewProjectClose,
    handleDeleteProjectClick,
    handleDeleteProjectClose,
    handleCopyProjectClose,
  };
}

export default useHome;
