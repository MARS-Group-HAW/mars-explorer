import { ModelRef } from "@shared/types/Model";
import { useBoolean } from "react-use";
import { useState } from "react";
import ExampleProject from "@shared/types/ExampleProject";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectProject,
  setProject as setGlobalProject,
} from "../utils/project-slice";
import useProjects from "./use-projects";
import { resetStore } from "../../../utils/store";
import { selectExampleProjects } from "../../Model/utils/model-slice";

export enum HomeTab {
  MY_PROJECTS,
  EXAMPLES,
}

type State = {
  tab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
  projects: ModelRef[];
  exampleProjects: ExampleProject[];
  processingModel?: ModelRef;
  isModelSelected: (project: ModelRef) => boolean;
  hasModelBeenCopied: (exampleProject: ExampleProject) => boolean;
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

  const { projects: userProjects, fetchProjects } = useProjects();
  const exampleProjects = useAppSelector(selectExampleProjects);

  const [modelRef, setModelRef] = useState<ModelRef>();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useBoolean(false);
  const [deleteProjectDialogOpen, setDeleteDialogOpen] = useBoolean(false);
  const [copyProjectDialogOpen, setCopyProjectDialogOpen] = useBoolean(false);

  const [tab, setTab] = useState(HomeTab.MY_PROJECTS);

  const isModelSelected = (project: ModelRef) => project.path === path;

  const hasModelBeenCopied = (exampleProject: ExampleProject) =>
    userProjects.map((project) => project.name).includes(exampleProject.name);

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

  return {
    tab,
    onTabChange: setTab,
    projects: userProjects,
    exampleProjects,
    processingModel: modelRef,
    isModelSelected,
    hasModelBeenCopied,
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
