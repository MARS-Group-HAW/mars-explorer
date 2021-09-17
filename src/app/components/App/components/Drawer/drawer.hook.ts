import { selectProject } from "@app/components/Home/utils/project-slice";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import Path from "../../utils/app-paths";

type State = {
  disableNavigation: boolean;
};

function useDrawer(): State {
  const { path } = useAppSelector(selectProject);

  const { replace } = useHistory();

  useEffect(() => path && replace(Path.MODEL), [path]);

  return {
    disableNavigation: !path,
  };
}

export default useDrawer;
