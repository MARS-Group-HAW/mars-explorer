import { useEffect } from "react";

type Props<T> = {
  step: T;
  isLoading: boolean;
  resetLoading: (step: T) => void;
  finishLoading: (step: T) => void;
};

function useLoadingStep<LoadingSteps>({
  step,
  isLoading,
  resetLoading,
  finishLoading,
}: Props<LoadingSteps>) {
  useEffect(() => {
    window.api.logger.info(`${step}: ${!isLoading}`);
    if (isLoading) {
      resetLoading(step);
    } else {
      finishLoading(step);
    }
  }, [isLoading]);
}

export default useLoadingStep;
