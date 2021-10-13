import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import { useContext, useEffect } from "react";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import {
  finishLoadingStep,
  resetLoadingStep,
  selectFrameworkAdded,
} from "../../../../Model/utils/model-slice";
import useChannelSubscription from "../../../../../utils/hooks/use-channel-subscription";
import { SnackBarContext } from "../../../../shared/snackbar/snackbar-provider";

function useProjectInitialization(path?: string) {
  const isFrameworkAdded = useAppSelector(selectFrameworkAdded);
  const { addWarningAlert } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useBoolean(true);
  const dispatch = useAppDispatch();

  const handleRestoration = (success: boolean) => {
    if (!success) {
      addWarningAlert({
        msg: "An error occurred while restoring your project. Your project might still be able to work.",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (path && isFrameworkAdded) {
      setIsLoading(true);
      window.api.send(Channel.RESTORE_PROJECT, path);
    }
  }, [path, isFrameworkAdded]);

  useChannelSubscription(Channel.PROJECT_RESTORED, handleRestoration);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.PROJECT_INITIALIZED,
    isLoading,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.PROJECT_INITIALIZED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.PROJECT_INITIALIZED)),
  });
}

export default useProjectInitialization;
