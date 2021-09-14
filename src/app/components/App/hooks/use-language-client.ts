import { useState } from "react";
import { MonacoLanguageClient } from "monaco-languageclient";
import { useAsync } from "react-use";
import startLanguageClient from "../../../standalone/monaco-editor/client";
import useRootUri from "./use-root-uri";

type State = {
  isLoading: boolean;
};

function useLanguageClient(path: string, areServicesInstalled: boolean): State {
  const { rootUri } = useRootUri(path);
  const [, setMonacoLanguageClient] = useState<MonacoLanguageClient>();

  const { loading } = useAsync(async () => {
    if (!rootUri || !areServicesInstalled) return;

    const client = await startLanguageClient(rootUri);
    setMonacoLanguageClient(client);
  }, [areServicesInstalled]);

  return {
    isLoading: loading,
  };
}

export default useLanguageClient;
