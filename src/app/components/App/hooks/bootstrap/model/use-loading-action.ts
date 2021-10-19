import { useEffect } from "react";
import { useBoolean, useLatest } from "react-use";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import {
  finishLoadingStep,
  selectLoadingSteps,
} from "../../../../Model/utils/model-slice";
import { LoadingAction } from "./types";

const includesAll = (loaded: LoadingSteps[], deps: LoadingSteps[]) =>
  deps.every((step) => loaded.includes(step));

function useLoadingAction(
  action: LoadingAction,
  step: LoadingSteps,
  deps: LoadingSteps[] = []
) {
  const [isActionRunning, setActionRunning] = useBoolean(false);
  const latestRunningStatus = useLatest(isActionRunning);
  const dispatch = useAppDispatch();
  const finishedLoadingSteps = useAppSelector(selectLoadingSteps);

  useEffect(() => {
    if (
      latestRunningStatus.current ||
      !finishedLoadingSteps ||
      finishedLoadingSteps.includes(step) ||
      !includesAll(finishedLoadingSteps, deps)
    ) {
      return;
    }
    setActionRunning(true);
    action()
      .then(() => dispatch(finishLoadingStep(step)))
      .catch(() => {})
      .finally(() => setActionRunning(false));
  }, [action, finishedLoadingSteps]);
}

export default useLoadingAction;
