import { useBoolean, useLatest, useMount, usePrevious } from "react-use";
import { Channel } from "@shared/types/Channel";
import { createMessageConnection } from "vscode-jsonrpc";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Disposable } from "@codingame/monaco-languageclient";
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
  selectFrameworkAdded,
  selectModelsWithoutMeta,
  selectMonacoServicesInstalled,
  selectProjectRestored,
} from "../../../../Model/utils/model-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import monaco from "../../../../../standalone/monaco-editor/monaco";

function useLanguageClient(path: string) {
  const dispatch = useAppDispatch();
  const { rootUri } = useRootUri(path);
  const latestRootUri = useLatest(rootUri);
  const { handleMessage } = useDiagnosticsMessages();
  const areServicesInstalled = useAppSelector(selectMonacoServicesInstalled);
  const isFrameworkAdded = useAppSelector(selectFrameworkAdded);
  const isProjectRestored = useAppSelector(selectProjectRestored);
  const models = useAppSelector(selectModelsWithoutMeta);
  const [isLoading, setIsLoading] = useBoolean(true);
  const [isInitializing, setIsInitializing] = useBoolean(true);
  const [client, setClient] = useState<CSharpLanguageClient>();

  const ref = useRef<Disposable>();

  const shutdownServer = useCallback(
    async () => (client ? client.stop() : Promise.resolve()),
    [client]
  );

  useMount(() =>
    window.api.on(Channel.SHUTDOWN, () =>
      shutdownServer().then(() => window.api.send(Channel.SERVER_SHUTDOWN))
    )
  );

  const startLanguageServer = async () => {
    setClient(undefined);
    setIsLoading(true);

    if (ref.current) {
      ref.current.dispose();
    }

    const ipcChannel = await window.api.invoke(
      Channel.START_LANGUAGE_SERVER,
      latestRootUri.current
    );

    // wire up the IPC connection
    const reader = new RendererIpcMessageReader(ipcChannel);
    reader.listen(handleMessage);
    const writer = new RendererIpcMessageWriter(ipcChannel);
    const connection = createMessageConnection(reader, writer);

    // create and start the language client
    const newClient = new CSharpLanguageClient(connection);
    ref.current = newClient.start();

    setIsLoading(false);
    setIsInitializing(true);

    newClient.onReady().then(() => {
      setIsInitializing(false);
      setClient(newClient);
    });
  };

  const previousModels = usePrevious(models);

  useEffect(() => {
    // model deleted?
    if (
      !client ||
      !previousModels ||
      Math.abs(models.length - previousModels.length) !== 1
    ) {
      return;
    }

    const modelAdded = models.length > previousModels.length;

    const diffModel = _.xor(models, previousModels)[0];
    const diffModelUri = monaco.Uri.file(diffModel.path).toString();

    if (modelAdded) {
      window.api.logger.info(
        "Notifying about model creation: ",
        diffModel.name
      );
      client.notifyFileCreate(diffModelUri);
    } else {
      window.api.logger.info(
        "Notifying about model deletion: ",
        diffModel.name
      );
      client.notifyFileDelete(diffModelUri);
    }
  }, [client, models, previousModels]);

  useEffect(() => {
    if (
      !rootUri ||
      !areServicesInstalled ||
      !isFrameworkAdded ||
      !isProjectRestored
    )
      return;
    startLanguageServer();
  }, [rootUri, areServicesInstalled, isFrameworkAdded, isProjectRestored]);

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
