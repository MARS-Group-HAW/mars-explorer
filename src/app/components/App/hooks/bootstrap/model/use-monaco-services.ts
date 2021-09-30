import { useEffect, useState } from "react";
import { MonacoServices } from "monaco-languageclient";
import monaco from "../../../../../standalone/monaco-editor/monaco";
import useRootUri from "./use-root-uri";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  resetLoadingStep,
} from "../../../../Model/utils/model-slice";
import { useAppDispatch } from "../../../../../utils/hooks/use-store";

function useMonacoServices(path: string) {
  const dispatch = useAppDispatch();

  const { rootUri } = useRootUri(path);

  const [monacoServices, setMonacoService] = useState<MonacoServices>();

  useEffect(() => {
    if (!rootUri) return;
    setMonacoService(undefined);
    setMonacoService(MonacoServices.install(monaco, { rootUri }));
  }, [rootUri]);

  useEffect(() => {
    console.log("services changed");
  }, [monacoServices]);

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.MONACO_SERVICES_INSTALLED,
    isLoading: !monacoServices,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.MONACO_SERVICES_INSTALLED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.MONACO_SERVICES_INSTALLED)),
  });
}

export default useMonacoServices;
