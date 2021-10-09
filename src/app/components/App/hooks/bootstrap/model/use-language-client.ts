import { useBoolean, useCustomCompareEffect, useLatest } from "react-use";
import { Channel } from "@shared/types/Channel";
import { createMessageConnection } from "vscode-jsonrpc";
import { useContext, useEffect } from "react";
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
  selectLanguageServerInitializeStatus,
  selectModels,
  selectMonacoServicesInstalled,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { SnackBarContext } from "../../../../shared/snackbar/snackbar-provider";

function useLanguageClient(path: string) {
  const { addWarningAlert, addErrorAlert } = useContext(SnackBarContext);
  const dispatch = useAppDispatch();
  const { rootUri } = useRootUri(path);
  const { handleMessage } = useDiagnosticsMessages();
  const areServicesInstalled = useAppSelector(selectMonacoServicesInstalled);
  const isServerInitialized = useAppSelector(
    selectLanguageServerInitializeStatus
  );
  const models = useAppSelector(selectModels);
  const [isLoading, setIsLoading] = useBoolean(true);
  const [hasBeenCleaned, setHasBeenCleaned] = useBoolean(false);

  const latestInit = useLatest(isServerInitialized);
  const latestBeenCleaned = useLatest(hasBeenCleaned);

  async function afterTimeout() {
    if (latestInit.current) return;

    if (latestBeenCleaned.current) {
      addErrorAlert({
        msg: "The server could not be started. Make sure that the project is created by the MARS-Explorer or is based on an example project. You can still make changes to your files but they won't be validated.",
      });
      dispatch(finishLoadingStep(LoadingSteps.LANGUAGE_SERVER_INITIALIZED));
    } else {
      cleanAndRestart();
    }
  }

  const startLanguageServer = async () => {
    window.api.send(Channel.STOP_LANGUAGE_SERVER);
    setIsLoading(true);
    const ipcChannel = await window.api.invoke(
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
    setIsLoading(false);

    setTimeout(afterTimeout, 30000);
  };

  async function cleanAndRestart() {
    try {
      addWarningAlert({
        msg: "Seems like the validation server takes too long. Cleaning your project and restarting in the background ...",
      });
      await window.api.invoke(Channel.CLEAN_PROJECT, path);
    } catch (e: unknown) {
      addErrorAlert({ msg: `There was an error cleaning your project: ${e}` });
    } finally {
      setHasBeenCleaned(true);
      startLanguageServer();
    }
  }

  useEffect(() => {
    if (!rootUri || !areServicesInstalled) return;
    setHasBeenCleaned(false);
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
}

export default useLanguageClient;
