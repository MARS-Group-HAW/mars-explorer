import { Channel } from "@shared/types/Channel";
import { useBoolean, useCustomCompareEffect, useUpdateEffect } from "react-use";
import { useEffect } from "react";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  resetLoadingStep,
  selectModels,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import useChannelSubscription from "../../../../../utils/hooks/use-channel-subscription";

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
      console.log("models changed");
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
