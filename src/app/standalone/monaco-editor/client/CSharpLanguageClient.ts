import {
  CloseAction,
  createConnection,
  DidChangeWatchedFilesNotification,
  DidChangeWatchedFilesParams,
  ErrorAction,
  MessageConnection,
  MonacoLanguageClient,
} from "@codingame/monaco-languageclient";
import { Trace } from "vscode-jsonrpc";
import { FileChangeType } from "vscode-languageserver";

class CSharpLanguageClient extends MonacoLanguageClient {
  constructor(connection: MessageConnection) {
    super({
      id: "csharp-lsp",
      clientOptions: {
        documentSelector: ["csharp"],
        errorHandler: {
          closed: () => CloseAction.DoNotRestart,
          error: () => ErrorAction.Continue,
        },
      },
      connectionProvider: {
        get: async (errorHandler, closeHandler) =>
          createConnection(connection, errorHandler, closeHandler),
      },
      name: "C# Language Server",
    });

    this.trace = Trace.Messages;
  }

  public notifyFileCreate = (uri: string) => {
    this.notifyDidChangeWatchedFile({
      uri,
      type: FileChangeType.Created,
    });
  };

  public notifyFileDelete = (uri: string) => {
    this.notifyDidChangeWatchedFile({
      uri,
      type: FileChangeType.Deleted,
    });
  };

  private notifyDidChangeWatchedFile = (
    change: DidChangeWatchedFilesParams["changes"][number]
  ) => {
    this.sendNotification(DidChangeWatchedFilesNotification.type, {
      changes: [change],
    });
  };
}

export default CSharpLanguageClient;
