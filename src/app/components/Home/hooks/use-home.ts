import { useState } from "react";
import { ModelRef } from "@shared/types/Model";
import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";

type Props = {
  setLoading: (isLoading: boolean) => void;
};

type State = {
  projects: ModelRef[];
  handleProjectClick: (model: ModelRef) => void;
};

function useHome({ setLoading }: Props): State {
  const [projects, setProject] = useState<ModelRef[]>([]);

  useAsync(async () => {
    const userProjects = await window.api.invoke<void, ModelRef[]>(
      Channel.GET_USER_PROJECTS
    );
    setProject(userProjects);
    setLoading(false);
  }, []);

  const handleProjectClick = (project: ModelRef) => {
    console.log("Project was clicked: ", project);
  };

  return { projects, handleProjectClick };
}

export default useHome;
