import { useAppSelector } from "@app/components/App/hooks/use-store";
import { selectProject } from "@app/components/Home/utils/project-slice";

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
