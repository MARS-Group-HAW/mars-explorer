/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
// import * as fs from 'fs';
import * as rpc from "@codingame/monaco-jsonrpc";
import * as server from "@codingame/monaco-jsonrpc/lib/server";
import uri2path from "file-uri-to-path";

import {
  DidOpenTextDocumentNotification,
  DidOpenTextDocumentParams,
  InitializeParams,
  InitializeRequest,
} from "vscode-languageserver";
import { Servers } from "./config";
import { logger } from "./logger";
import fs = require("fs-extra");
import { SERVER_NAMES } from "./types/OmnisharpServerConfiguration";

export function launch(socket: rpc.IWebSocket) {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);

  // start the language server as an external process
  // @ts-ignore
  const socketConnection = server.createConnection(reader, writer, () =>
    socket.dispose()
  );
  const connectTo = Servers[SERVER_NAMES.OMNISHARP_TEMP_13712];
  const serverConnection = server.createServerProcess(
    SERVER_NAMES.OMNISHARP_TEMP_13712,
    connectTo.command,
    connectTo.args,
    connectTo.options
  );
  server.forward(socketConnection, serverConnection, (message) => {
    if (rpc.isRequestMessage(message)) {
      if (message.method === InitializeRequest.type.method) {
        const initializeParams = message.params as InitializeParams;
        initializeParams.processId = process.pid;
      }
    }
    if (rpc.isNotificationMessage(message)) {
      switch (message.method) {
        case DidOpenTextDocumentNotification.type.method: {
          const didOpenParams = message.params as DidOpenTextDocumentParams;
          const uri = didOpenParams.textDocument.uri;
          const text = didOpenParams.textDocument.text;
          const uriAsPath = uri2path(uri);

          if (uri) fs.writeFileSync(uriAsPath, text);
          break;
        }
      }
    }

    if ("params" in message && "message" in message["params"]) {
      logger.debug(message["params"]["message"]);
    }

    return message;
  });
}
