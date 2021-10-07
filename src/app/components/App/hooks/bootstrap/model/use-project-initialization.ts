import { Channel } from "@shared/types/Channel";
import {
  useBoolean,
  useCustomCompareEffect,
  useTimeoutFn,
  useUpdateEffect,
} from "react-use";
import { useEffect, useState } from "react";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  resetLoadingStep,
  selectLanguageServerStartStatus,
  selectModels,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import useChannelSubscription from "../../../../../utils/hooks/use-channel-subscription";

const LANGUAGE_SERVER_STARTUP_TIMEOUT = 60000;

function useProjectInitialization(path?: string) {
  const dispatch = useAppDispatch();
  const models = useAppSelector(selectModels);
  const [initialized, setInitialized] = useBoolean(false);

  useChannelSubscription(Channel.PROJECT_INITIALIZED, () =>
    setInitialized(true)
  );

  useEffect(() => setInitialized(false), [path]);

  useCustomCompareEffect(
    () => {
      if (!initialized) return;
      // reinitialize if on model added
      setInitialized(false);
    },
    [models],
    (prevDeps, nextDeps) => prevDeps[0].length === nextDeps[0].length
  );

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
