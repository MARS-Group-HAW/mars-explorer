import { Channel } from "@shared/types/Channel";
import { useCallback, useContext } from "react";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import { SnackBarContext } from "../../../../shared/snackbar/snackbar-provider";
import useLoadingAction from "./use-loading-action";
import { LoadingAction } from "./types";

function useProjectRestore(path?: string) {
  const { addWarningAlert } = useContext(SnackBarContext);

  const printRestoreError = () =>
    addWarningAlert({
      msg: "An error occurred while restoring your project. Your project might still be able to work.",
    });

  const loadingAction: LoadingAction = useCallback(() => {
    if (!path) return Promise.reject();

    window.api.logger.info("Restoring Project");
    window.api.send(Channel.RESTORE_PROJECT, path);

    return new Promise((resolve) =>
      window.api.once(Channel.PROJECT_RESTORED, (success: boolean) => {
        if (!success) printRestoreError();

        resolve();
      })
    );
  }, [path]);

  useLoadingAction(loadingAction, LoadingSteps.PROJECT_RESTORED, [
    LoadingSteps.MARS_FRAMEWORK_ADDED,
  ]);
}

export default useProjectRestore;
