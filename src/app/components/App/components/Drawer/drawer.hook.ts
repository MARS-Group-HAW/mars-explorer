import { selectProject } from "@app/components/Home/utils/project-slice";
import { useAppSelector } from "../../../../utils/hooks/use-store";

type State = {
  disableNavigation: boolean;
};

function useDrawer(): State {
  const { path } = useAppSelector(selectProject);

  return {
    disableNavigation: !path,
  };
}

export default useDrawer;
