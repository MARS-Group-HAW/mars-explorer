import { ModelRef } from "@shared/types/Model";
import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  selectProject,
  setProject as setGlobalProject,
} from "../utils/project-slice";

type State = {
  projects: ModelRef[];
  isModelSelected: (project: ModelRef) => boolean;
  handleProjectClick: (model: ModelRef) => void;
};

function useHome(): State {
  const dispatch = useAppDispatch();
  const { path } = useAppSelector(selectProject);

  const { value = [] } = useAsync(
    async () => window.api.invoke<void, ModelRef[]>(Channel.GET_USER_PROJECTS),
    []
  );

  const isModelSelected = (project: ModelRef) => project.path === path;

  const handleProjectClick = (modelRef: ModelRef) =>
    dispatch(setGlobalProject(modelRef));

  return { projects: value, isModelSelected, handleProjectClick };
}

export default useHome;
