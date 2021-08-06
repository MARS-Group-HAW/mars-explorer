import {
  CloseAction,
  createConnection,
  Disposable,
  ErrorAction,
  MessageConnection,
  MonacoLanguageClient,
} from "monaco-languageclient";
import {
  createMessageConnection,
  DataCallback,
  Message,
  MessageReader,
  MessageWriter,
  Trace,
} from "vscode-jsonrpc";
import { Channel } from "@shared/types/Channel";

export async function startLanguageClient(): Promise<MonacoLanguageClient> {
  // launch language server
  const ipcChannel = await window.api.invoke<void, string>(
    Channel.START_LANGUAGE_SERVER
  );

  // wire up the IPC connection
  const reader = new RendererIpcMessageReader(ipcChannel);
  const writer = new RendererIpcMessageWriter(ipcChannel);
  const connection = createMessageConnection(reader, writer);

  // create and start the language client
  const client = createBaseLanguageClient(connection);
  client.start();

  return client;
}

function createBaseLanguageClient(connection: MessageConnection) {
  const client = new MonacoLanguageClient({
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

// custom implementations of the MessageReader and MessageWriter to plug into a MessageConnection
class RendererIpcMessageReader implements MessageReader {
  private subscribers: DataCallback[] = [];

  constructor(private channel: string) {
    // listen to incoming language server notifications and messages from the backend
    window.api.on(this.channel, (msg) => {
      this.notifySubscribers(msg);
    });
  }

  // events are not implemented for this example
  public onError = () => dummyDisposable();
  public onClose = () => dummyDisposable();
  public onPartialMessage = () => dummyDisposable();

  public listen(callback: DataCallback): Disposable {
    this.subscribers.push(callback);
    return dummyDisposable();
  }

  public dispose(): void {
    return;
  }

  private notifySubscribers = (msg: Message) => {
    this.subscribers.forEach((s) => s(msg));
  };
}

class RendererIpcMessageWriter implements MessageWriter {
  constructor(private channel: string) {}

  // events are not implemented for this example
  public onError = () => dummyDisposable();
  public onClose = () => dummyDisposable();

  public write(msg: Message): Promise<void> {
    // send all requests for the language server to the backend
    return Promise.resolve(window.api.send(this.channel, msg));
  }

  public dispose(): void {
    // nothing to dispose
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  end(): void {}
}

// dummy disposable to satisfy interfaces
function dummyDisposable(): Disposable {
  return {
    dispose: () => void 0,
  };
}
