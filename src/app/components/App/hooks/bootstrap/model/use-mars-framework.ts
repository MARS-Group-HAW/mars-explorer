import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import { useEffect } from "react";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import { useAppDispatch } from "../../../../../utils/hooks/use-store";
import {
  finishLoadingStep,
  resetLoadingStep,
} from "../../../../Model/utils/model-slice";
import useChannelSubscription from "../../../../../utils/hooks/use-channel-subscription";

function useMarsFramework(path?: string) {
  const [isLoading, setIsLoading] = useBoolean(true);

  const dispatch = useAppDispatch();

  const installMars = () => {
    if (path) {
      setIsLoading(true);
      window.api.send(Channel.INSTALL_MARS, path);
    }
  };

  const handleMarsInstallation = () => setIsLoading(false);

  useEffect(installMars, [path]);

  useChannelSubscription(Channel.MARS_INSTALLED, handleMarsInstallation);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.MARS_FRAMEWORK_ADDED,
    isLoading,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.MARS_FRAMEWORK_ADDED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.MARS_FRAMEWORK_ADDED)),
  });
}

export default useMarsFramework;
