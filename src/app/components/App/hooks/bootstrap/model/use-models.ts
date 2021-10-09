import { ModelRef, WorkingModel } from "@shared/types/Model";
import { useAsync, useBoolean } from "react-use";
import { Channel } from "@shared/types/Channel";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import {
  finishLoadingStep,
  resetLoadingStep,
  setModel,
} from "../../../../Model/utils/model-slice";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";

type State = void;

function useModels(): State {
  const dispatch = useAppDispatch();
  const { path, name } = useAppSelector(selectProject);
  const [loading, setLoading] = useBoolean(true);

  useAsync(async () => {
    if (path) {
      setLoading(true);
      const workingModel = await window.api.invoke(Channel.GET_USER_PROJECT, {
        path,
        name,
      });
      dispatch(setModel(workingModel));
      setLoading(false);
    }
  }, [path]);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.MODELS_READ,
    isLoading: loading,
    resetLoading: () => dispatch(resetLoadingStep(LoadingSteps.MODELS_READ)),
    finishLoading: () => dispatch(finishLoadingStep(LoadingSteps.MODELS_READ)),
  });
}

export default useModels;
