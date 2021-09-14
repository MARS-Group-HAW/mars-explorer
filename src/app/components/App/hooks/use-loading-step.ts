import { useEffect } from "react";
import {
  finishLoadingStep,
  LoadingSteps,
  resetLoadingStep,
} from "../../Home/utils/project-slice";
import { useAppDispatch } from "../../../utils/hooks/use-store";

function useLoadingStep(loadingStep: LoadingSteps, isLoading: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.api.logger.info(`${loadingStep}: ${!isLoading}`);
    if (isLoading) {
      dispatch(resetLoadingStep(loadingStep));
    } else {
      dispatch(finishLoadingStep(loadingStep));
    }
  }, [isLoading]);
}

export default useLoadingStep;
