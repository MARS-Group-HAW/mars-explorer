import ExampleProject from "@shared/types/ExampleProject";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectExampleProjects } from "../../utils/model-slice";

type State = {
  projects: ExampleProject[];
};

function useModelList(): State {
  const projects = useAppSelector(selectExampleProjects);

  return {
    projects,
  };
}

export default useModelList;
