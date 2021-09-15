import {
  CloseAction,
  createConnection,
  ErrorAction,
  MessageConnection,
  MonacoLanguageClient,
} from "monaco-languageclient";
import { Trace } from "vscode-jsonrpc";

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
}

export default CSharpLanguageClient;
