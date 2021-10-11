import { useEffect, useState } from "react";
import { MonacoServices, Services } from "monaco-languageclient";
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
    if (!rootUri) return () => {};
    setMonacoService(undefined);

    const service = MonacoServices.create(monaco, { rootUri });
    const disposable = Services.install(service);
    setMonacoService(service);
    return () => disposable.dispose();
  }, [rootUri]);

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
