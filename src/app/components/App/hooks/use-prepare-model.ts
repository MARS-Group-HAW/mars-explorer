import { useEffect } from "react";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  LoadingSteps,
  resetLoadingSteps,
  selectProject,
} from "../../Home/utils/project-slice";
import useProjectInitialization from "./use-project-initialization";
import useLoadingStep from "./use-loading-step";
import { selectModel } from "../../Model/utils/model-slice";

type State = {};

function usePrepareModel(): State {
  const { path } = useAppSelector(selectProject);

  // FIXME temp
  /*
  const { hasErrorsIn } = useAppSelector(selectModel);
  useEffect(() => console.log("Errors in: ", hasErrorsIn), [hasErrorsIn]);
   */

  const dispatch = useAppDispatch();

  const { isLoading: isFrameworkLoading } = useMarsFramework(path);
  const { isLoading: areServicesLoading } = useMonacoServices(path);
  const { isLoading: isClientLoading } = useLanguageClient(
    path,
    !areServicesLoading
  );
  const { isLoading: isProjectLoading } = useProjectInitialization(path);

  useEffect(() => {
    if (!path) {
      dispatch(resetLoadingSteps);
    }
  }, [path]);

  useLoadingStep(LoadingSteps.DOTNET_INSTALLED, isFrameworkLoading);
  useLoadingStep(LoadingSteps.MONACO_SERVICES_INSTALLED, areServicesLoading);
  useLoadingStep(LoadingSteps.LANGUAGE_CLIENT_STARTED, isClientLoading);
  useLoadingStep(LoadingSteps.PROJECT_INITIALIZED, isProjectLoading);

  return {};
}

export default usePrepareModel;
