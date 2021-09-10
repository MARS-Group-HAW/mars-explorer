import { useEffect, useState } from "react";
import { MonacoServices } from "monaco-languageclient";
import monaco from "../../../standalone/monaco-editor/monaco";
import useRootUri from "./use-root-uri";

type State = {
  isLoading: boolean;
};

function useMonacoServices(path: string): State {
  const { rootUri } = useRootUri(path);

  const [monacoServices, setMonacoService] = useState<MonacoServices>();

  useEffect(() => {
    if (!rootUri) return;
    setMonacoService(undefined);
    setMonacoService(MonacoServices.install(monaco, { rootUri }));
    window.api.logger.info("Monaco Services installed (2/3)");
  }, [rootUri]);

  return {
    isLoading: !monacoServices,
  };
}

export default useMonacoServices;
