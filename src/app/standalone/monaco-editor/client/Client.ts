import {
  CloseAction,
  createConnection,
  ErrorAction,
  MessageConnection,
  MonacoLanguageClient,
} from "monaco-languageclient";
import { createMessageConnection, Trace } from "vscode-jsonrpc";
import { Channel } from "@shared/types/Channel";
import RendererIpcMessageReader from "./RendererIpcMessageReader";
import RendererIpcMessageWriter from "./RendererIpcMessageWriter";

function createBaseLanguageClient(connection: MessageConnection) {
  const client = new MonacoLanguageClient({
    id: "csharp-lsp",
    clientOptions: {
      documentSelector: ["csharp"],
      errorHandler: {
        closed: () => CloseAction.DoNotRestart,
        error: () => ErrorAction.Continue,
      },
    },
    connectionProvider: {
      // eslint-disable-next-line @typescript-eslint/require-await
      get: async (errorHandler, closeHandler) =>
        createConnection(connection, errorHandler, closeHandler),
    },
    name: "C# Language Server",
  });

  // for debugging
  client.trace = Trace.Messages;

  return client;
}

async function startLanguageClient(): Promise<MonacoLanguageClient> {
  // launch language server
  const ipcChannel = await window.api.invoke<void, string>(
    Channel.START_LANGUAGE_SERVER
  );

  // wire up the IPC connection
  const reader = new RendererIpcMessageReader(ipcChannel);
  const writer = new RendererIpcMessageWriter(ipcChannel);
  const connection = createMessageConnection(reader, writer);

  // FIXME doppelte writings zum lsp
  // create and start the language client
  const client = createBaseLanguageClient(connection);

  client.start();

  return client;
}

export default startLanguageClient;
