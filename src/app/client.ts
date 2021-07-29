import { listen } from "@codingame/monaco-jsonrpc";
import {
  CloseAction,
  createConnection,
  Disposable,
  ErrorAction,
  MessageConnection,
  MonacoLanguageClient,
} from "monaco-languageclient";

export class Client {
  private readonly path = "/socket";
  private readonly url: string;
  private readonly webSocket: WebSocket;

  constructor(port: number) {
    this.url = Client.createUrl(this.path, port);
    window.api.logger.info(`Creating WebSocket at ${this.url}`);
    this.webSocket = new WebSocket(this.url, []);

    listen({
      webSocket: this.webSocket,
      logger: window.api.logger,
      onConnection: (connection) => {
        window.api.logger.info("WebSocket connected!");
        // create and start the language client
        window.api.logger.info("Creating Language Client");
        const languageClient = this.createLanguageClient(connection);
        window.api.logger.info("Starting Language Client");
        const disposable: Disposable = languageClient.start();

        connection.onClose(() => {
          window.api.logger.info("WebSocket closed!");
          disposable.dispose();
        });
      },
    });
  }

  public close = (): void => this.webSocket.close();

  private static createUrl(path: string, port: number): string {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://localhost:${port}${path}`;
  }

  private createLanguageClient(
    connection: MessageConnection
  ): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: "Sample Language Client",
      clientOptions: {
        // use a language id as a document selector
        documentSelector: ["csharp"],
        // disable the default error handler
        errorHandler: {
          error: (error, message, count) => {
            window.api.logger.error(
              `Error in Language Client: `,
              message,
              count
            );
            return ErrorAction.Shutdown;
          },
          closed: () => CloseAction.DoNotRestart,
        },
      },
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler: any, closeHandler: any) => {
          return Promise.resolve(
            createConnection(connection, errorHandler, closeHandler)
          );
        },
      },
    });
  }
}
