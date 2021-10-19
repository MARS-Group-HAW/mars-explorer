import { Channel } from "@shared/types/Channel";
import { useCallback } from "react";
import { LoadingAction } from "./types";
import useLoadingAction from "./use-loading-action";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";

function useMarsFramework(path?: string) {
  const loadingAction: LoadingAction = useCallback(() => {
    if (!path) return Promise.reject();

    window.api.logger.info("Installing MARS Framework");
    window.api.send(Channel.INSTALL_MARS, path);

    return new Promise((resolve) =>
      window.api.once(Channel.MARS_INSTALLED, () => resolve())
    );
  }, [path]);

  useLoadingAction(loadingAction, LoadingSteps.MARS_FRAMEWORK_ADDED);
}

export default useMarsFramework;
