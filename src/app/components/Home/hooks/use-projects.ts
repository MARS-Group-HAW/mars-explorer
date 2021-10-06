import { ModelRef } from "@shared/types/Model";
import { useMount } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext, useState } from "react";
import { SnackBarContext } from "../../shared/snackbar/snackbar-provider";

type State = {
  projects: ModelRef[];
  fetchProjects: () => void;
};

function useProjects(
  channel: Channel.GET_USER_PROJECTS | Channel.GET_EXAMPLE_PROJECTS
): State {
  const { addErrorAlert } = useContext(SnackBarContext);
  const [modelRefs, setModelRefs] = useState<ModelRef[]>([]);

  const fetchProjects = async () =>
    window.api
      .invoke<void, ModelRef[]>(channel)
      .then((refs) => setModelRefs(refs))
      .catch((e: any) =>
        addErrorAlert({
          msg: `An error occured while trying to access your ${
            channel === Channel.GET_EXAMPLE_PROJECTS ? "example" : ""
          } projects: ${e}`,
        })
      );

  useMount(fetchProjects);

  return {
    projects: modelRefs,
    fetchProjects,
  };
}

export default useProjects;
