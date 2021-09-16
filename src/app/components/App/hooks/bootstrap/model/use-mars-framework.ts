import { Channel } from "@shared/types/Channel";
import { useAsync } from "react-use";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import { useAppDispatch } from "../../../../../utils/hooks/use-store";
import {
  finishLoadingStep,
  resetLoadingStep,
} from "../../../../Model/utils/model-slice";

function useMarsFramework(path?: string) {
  const dispatch = useAppDispatch();

  const { loading } = useAsync(async () => {
    if (!path) return;

    try {
      await window.api.invoke<string, void>(Channel.INSTALL_MARS, path);
    } catch (e) {
      window.api.logger.error(e);
      throw e;
    }
  }, [path]);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.DOTNET_ADDED,
    isLoading: loading,
    resetLoading: () => dispatch(resetLoadingStep(LoadingSteps.DOTNET_ADDED)),
    finishLoading: () => dispatch(finishLoadingStep(LoadingSteps.DOTNET_ADDED)),
  });
}

export default useMarsFramework;
