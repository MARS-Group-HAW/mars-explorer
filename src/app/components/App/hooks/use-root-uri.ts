import { useEffect, useState } from "react";
import monaco from "../../../standalone/monaco-editor/monaco";

type State = {
  rootUri: string;
};

function useRootUri(path?: string): State {
  const [rootUri, setRootUri] = useState<string>();

  useEffect(() => {
    if (!path) return;

    setRootUri(monaco.Uri.parse(path).path);
  }, [path]);

  return {
    rootUri,
  };
}

export default useRootUri;
