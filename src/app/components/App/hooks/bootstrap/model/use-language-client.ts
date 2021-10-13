import { useBoolean, useCustomCompareEffect, useLatest } from "react-use";
import { Channel } from "@shared/types/Channel";
import { createMessageConnection } from "vscode-jsonrpc";
import { useEffect } from "react";
import useRootUri from "./use-root-uri";
import RendererIpcMessageReader from "../../../../../standalone/monaco-editor/client/RendererIpcMessageReader";
import RendererIpcMessageWriter from "../../../../../standalone/monaco-editor/client/RendererIpcMessageWriter";
import CSharpLanguageClient from "../../../../../standalone/monaco-editor/client";
import useDiagnosticsMessages from "./use-diagnostics-messages";
import useLoadingStep from "../../../../../utils/hooks/use-loading-step";
import LoadingSteps from "../../../../Model/utils/LoadingSteps";
import {
  finishLoadingStep,
  resetLoadingStep,
  selectModels,
  selectMonacoServicesInstalled,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";

function useLanguageClient(path: string) {
  const dispatch = useAppDispatch();
  const { rootUri } = useRootUri(path);
  const latestRootUri = useLatest(rootUri);
  const { handleMessage } = useDiagnosticsMessages();
  const areServicesInstalled = useAppSelector(selectMonacoServicesInstalled);
  const models = useAppSelector(selectModels);
  const [isLoading, setIsLoading] = useBoolean(true);
  const [isInitializing, setIsInitializing] = useBoolean(true);

  const startLanguageServer = async () => {
    window.api.send(Channel.STOP_LANGUAGE_SERVER);
    setIsLoading(true);
    const ipcChannel = await window.api.invoke(
      Channel.START_LANGUAGE_SERVER,
      latestRootUri.current
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

    setIsLoading(false);

    client.onReady().then(() => {
      setIsInitializing(false);
    });
  };

  useEffect(() => {
    if (!rootUri || !areServicesInstalled) return;
    startLanguageServer();
  }, [areServicesInstalled, rootUri]);

  useCustomCompareEffect(
    () => {
      if (isLoading) return;

      // restart language server if model added
      startLanguageServer();
    },
    [models],
    (prevDeps, nextDeps) => prevDeps[0].length === nextDeps[0].length
  );

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.LANGUAGE_CLIENT_STARTED,
    isLoading,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.LANGUAGE_CLIENT_STARTED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.LANGUAGE_CLIENT_STARTED)),
  });

  useLoadingStep<LoadingSteps>({
    step: LoadingSteps.LANGUAGE_SERVER_INITIALIZED,
    isLoading: isInitializing,
    resetLoading: () =>
      dispatch(resetLoadingStep(LoadingSteps.LANGUAGE_SERVER_INITIALIZED)),
    finishLoading: () =>
      dispatch(finishLoadingStep(LoadingSteps.LANGUAGE_SERVER_INITIALIZED)),
  });
}

export default useLanguageClient;
