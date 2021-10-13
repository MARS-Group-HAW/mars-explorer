import { useEffect } from "react";
import { MonacoServices, Services } from "@codingame/monaco-languageclient";
import { useBoolean } from "react-use";
import monaco from "../../../../../standalone/monaco-editor/monaco";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  selectMonacoServicesInstallStatus,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";

function useMonacoServices() {
  const dispatch = useAppDispatch();
  const isInstalled = useAppSelector(selectMonacoServicesInstallStatus);
  const [isInstalling, setInstalling] = useBoolean(true);

  useEffect(() => {
    const service = MonacoServices.create(monaco);
    const disposable = Services.install(service);
    setInstalling(false);
    return () => disposable.dispose();
  }, []);

  useEffect(() => {
    if (!isInstalled && !isInstalling) {
      dispatch(finishLoadingStep(LoadingSteps.MONACO_SERVICES_INSTALLED));
    }
  }, [isInstalled, isInstalling]);
}

export default useMonacoServices;
