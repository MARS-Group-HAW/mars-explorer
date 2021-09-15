import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { createMessageConnection } from "vscode-jsonrpc";
import { useEffect } from "react";
import useRootUri from "./use-root-uri";
import RendererIpcMessageReader from "../../../standalone/monaco-editor/client/RendererIpcMessageReader";
import RendererIpcMessageWriter from "../../../standalone/monaco-editor/client/RendererIpcMessageWriter";
import CSharpLanguageClient from "../../../standalone/monaco-editor/client";
import useDiagnosticsMessages from "./use-diagnostics-messages";

type State = {
  isLoading: boolean;
};

function useLanguageClient(path: string, areServicesInstalled: boolean): State {
  const { rootUri } = useRootUri(path);
  const { handleMessage } = useDiagnosticsMessages();

  const { value, loading } = useAsync(async () => {
    if (!rootUri || !areServicesInstalled) return null;

    const ipcChannel = await window.api.invoke<string, string>(
      Channel.START_LANGUAGE_SERVER,
      rootUri
    );

    // wire up the IPC connection
    const reader = new RendererIpcMessageReader(ipcChannel);
    reader.listen(handleMessage);
    const writer = new RendererIpcMessageWriter(ipcChannel);
    const connection = createMessageConnection(reader, writer);

    // FIXME doppelte writings zum lsp
    // create and start the language client
    const client = new CSharpLanguageClient(connection);
    client.start();
    return client;
  }, [areServicesInstalled]);

  useEffect(() => value && value.diagnostics.forEach(console.log));

  return {
    isLoading: loading,
  };
}

export default useLanguageClient;
