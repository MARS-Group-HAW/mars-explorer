import { Channel } from "@shared/types/Channel";
import { useAsync } from "react-use";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectProject } from "../../Home/utils/project-slice";

type State = {
  isInstalling: boolean;
  error?: Error;
};

function useInstallMarsFramework(): State {
  const { path } = useAppSelector(selectProject);

  const { loading, error } = useAsync(async () => {
    if (!path) return;

    try {
      await window.api.invoke<string, void>(Channel.INSTALL_MARS, path);
    } catch (e) {
      window.api.logger.error(e);
      throw e;
    }
  }, [path]);

  return {
    isInstalling: loading,
    error,
  };
}

export default useInstallMarsFramework;
