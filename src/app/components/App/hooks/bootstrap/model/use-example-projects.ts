import { useMount } from "react-use";
import { Channel } from "@shared/types/Channel";
import ExampleProject from "@shared/types/ExampleProject";
import { useAppDispatch } from "../../../../../utils/hooks/use-store";
import { setExampleProjects } from "../../../../Model/utils/model-slice";

type State = void;

function useExampleProjects(): State {
  const dispatch = useAppDispatch();

  const fetchExampleProjects = async () => {
    const exampleProjects = await window.api.invoke<void, ExampleProject[]>(
      Channel.GET_ALL_EXAMPLE_PROJECTS
    );
    dispatch(setExampleProjects(exampleProjects));
  };

  useMount(fetchExampleProjects);
}

export default useExampleProjects;
