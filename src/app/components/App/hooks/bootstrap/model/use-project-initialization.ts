import { Channel } from "@shared/types/Channel";
import { useBoolean, useEffectOnce } from "react-use";
import { useEffect } from "react";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  resetLoadingStep,
} from "../../../../Model/utils/model-slice";
import { useAppDispatch } from "../../../../../utils/hooks/use-store";

function useProjectInitialization(path?: string) {
  const dispatch = useAppDispatch();

  const [initialized, setInitialized] = useBoolean(false);

  useEffectOnce(() =>
    window.api.on(Channel.PROJECT_INITIALIZED, () => setInitialized(true))
  );

  useEffect(() => setInitialized(false), [path]);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.LANGUAGE_SERVER_INITIALIZED,
    isLoading: !initialized,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.LANGUAGE_SERVER_INITIALIZED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.LANGUAGE_SERVER_INITIALIZED)),
  });
}

export default useProjectInitialization;
