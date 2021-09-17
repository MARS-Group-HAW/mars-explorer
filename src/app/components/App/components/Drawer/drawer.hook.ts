import { selectProject } from "@app/components/Home/utils/project-slice";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../../utils/hooks/use-store";

type State = {
  disableNavigation: boolean;
};

function useDrawer(): State {
  const { path } = useAppSelector(selectProject);

  const { replace } = useHistory();

  // FIXME deactivated for debugging purposes
  // useEffect(() => path && replace(Path.MODEL), [path]);

  return {
    disableNavigation: !path,
  };
}

export default useDrawer;
