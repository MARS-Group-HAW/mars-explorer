import { useEffect } from "react";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  finishLoading,
  resetLoading,
  selectProject,
  setOneThirdLoaded,
  setThreeThirdsLoaded,
  setTwoThirdsLoaded,
  startLoading,
} from "../../Home/utils/project-slice";
import { setUnknownState } from "../../Configure/utils/config-slice";

type State = {};

function usePrepareModel(): State {
  const { path } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const { isLoading: isFrameworkLoading } = useMarsFramework(path);
  const { isLoading: areServicesLoading } = useMonacoServices(path);
  const { isLoading: isClientLoading } = useLanguageClient(
    path,
    !areServicesLoading
  );

  useEffect(() => {
    if (!path) {
      dispatch(resetLoading());
    }

    const loadedArr = [
      isFrameworkLoading,
      areServicesLoading,
      isFrameworkLoading,
    ];

    const loadedCount = loadedArr.filter((value) => value === false).length;

    switch (loadedCount) {
      case 0:
        dispatch(startLoading());
        break;
      case 1:
        dispatch(setOneThirdLoaded());
        break;
      case 2:
        dispatch(setTwoThirdsLoaded());
        break;
      case 3:
        dispatch(setThreeThirdsLoaded());
        break;
      default:
        dispatch(setUnknownState());
        break;
    }

    if (loadedCount === loadedArr.length) {
      setTimeout(() => dispatch(finishLoading()), 500);
    }
  }, [path, isFrameworkLoading, areServicesLoading, isClientLoading]);

  return {};
}

export default usePrepareModel;
