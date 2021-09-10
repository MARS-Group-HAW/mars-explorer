import { useEffect } from "react";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  finishLoadingStep,
  LoadingSteps,
  resetLoadingSteps,
  selectProject,
} from "../../Home/utils/project-slice";

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
      dispatch(resetLoadingSteps);
    }

    if (!isFrameworkLoading) {
      dispatch(finishLoadingStep(LoadingSteps.DOTNET_INSTALLED));
    }

    if (!areServicesLoading) {
      dispatch(finishLoadingStep(LoadingSteps.MONACO_SERVICES_INSTALLED));
    }

    if (!isClientLoading) {
      dispatch(finishLoadingStep(LoadingSteps.LANGUAGE_CLIENT_STARTED));
    }
  }, [path, isFrameworkLoading, areServicesLoading, isClientLoading]);

  return {};
}

export default usePrepareModel;
