import { useEffect } from "react";
import { Channel } from "@shared/types/Channel";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import {
  setLoadingState,
  setPathToConfig,
  setUnknownState,
} from "../../../../Configure/utils/config-slice";

function useConfigPath() {
  const { path } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const setConfigPaths = async () => {
    dispatch(setLoadingState());
    const configPath = await window.api.invoke<string, string>(
      Channel.GET_DEFAULT_CONFIG_PATH,
      path
    );
    dispatch(setPathToConfig(configPath));
  };

  useEffect(() => {
    if (path) {
      dispatch(setLoadingState());
      setConfigPaths();
    } else {
      dispatch(setUnknownState());
    }
  }, [path]);
}

export default useConfigPath;
