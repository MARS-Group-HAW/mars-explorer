import { useState } from "react";
import { ModelRef } from "@shared/types/Model";
import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useAppDispatch } from "../../../utils/hooks/use-store";
import { set } from "../utils/project-slice";

type State = {
  projects: ModelRef[];
  handleProjectClick: (model: ModelRef) => void;
};

function useHome(): State {
  const dispatch = useAppDispatch();

  const [projects, setProject] = useState<ModelRef[]>([]);

  useAsync(async () => {
    const userProjects = await window.api.invoke<void, ModelRef[]>(
      Channel.GET_USER_PROJECTS
    );
    setProject(userProjects);
  }, []);

  const handleProjectClick = (modelRef: ModelRef) => dispatch(set(modelRef));

  return { projects, handleProjectClick };
}

export default useHome;
