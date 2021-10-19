import { Channel } from "@shared/types/Channel";
import { useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import { setModel } from "../../../../Model/utils/model-slice";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import useLoadingAction from "./use-loading-action";
import { LoadingAction } from "./types";

type State = void;

function useModels(): State {
  const dispatch = useAppDispatch();
  const { path, name } = useAppSelector(selectProject);

  const loadingAction: LoadingAction = useCallback(async () => {
    if (!path) return Promise.reject();

    window.api.logger.info("Fetching Models");
    const workingModel = await window.api.invoke(Channel.GET_USER_PROJECT, {
      path,
      name,
    });
    dispatch(setModel(workingModel));

    return Promise.resolve();
  }, [path]);

  useLoadingAction(loadingAction, LoadingSteps.MODELS_READ);
}

export default useModels;
