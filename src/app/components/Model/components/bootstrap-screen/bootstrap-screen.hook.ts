import LoadingSteps from "../../utils/LoadingSteps";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectStepWithStatus } from "../../utils/model-slice";

type State = {
  show: boolean;
  stepWithStatus: {
    step: LoadingSteps;
    isLoading: boolean;
  }[];
};

function useBootstrapScreen(): State {
  const steps = useAppSelector(selectStepWithStatus);

  return {
    show: steps.some((step) => step.isLoading),
    stepWithStatus: steps,
  };
}

export default useBootstrapScreen;
