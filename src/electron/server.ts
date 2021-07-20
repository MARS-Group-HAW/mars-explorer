/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as ws from "ws";
import * as http from "http";
import * as url from "url";
import * as net from "net";
import express from "express";
import * as rpc from "@codingame/monaco-jsonrpc";
import { launch } from "./launch-lsp";

let expressServer: express.Express;
let wss: ws.Server;

/*
process.on('uncaughtException', function (err: any) {
    console.error('Uncaught Exception: ', err.toString());
    if (err.stack) {
        console.error(err.stack);
    }
});
 */

function onWsUpgrade(
  request: http.IncomingMessage,
  socket: net.Socket,
  head: Buffer
) {
  console.log(request.url);
  const pathname = request.url ? url.parse(request.url).pathname : undefined;
  console.log("upgraded", pathname);
  if (pathname === "/socket") {
    wss.handleUpgrade(request, socket, head, (webSocket) => {
      const socket: rpc.IWebSocket = {
        send: (content) =>
          webSocket.send(content, (error) => {
            if (error) {
              throw error;
            }
          }),
        onMessage: (cb) => webSocket.on("message", cb),
        onError: (cb) => webSocket.on("error", cb),
        onClose: (cb) => webSocket.on("close", cb),
        dispose: () => webSocket.close(),
      };
      // launch the server when the web socket is opened
      if (webSocket.readyState === webSocket.OPEN) {
        launch(socket);
      } else {
        webSocket.on("open", () => launch(socket));
      }
    });
  }
}

/**
 * Starts the local servers and returns the port
 */
export function startServer(): number {
  // create the express application
  expressServer = express();

  // server the static content, i.e. index.html
  // app.use(express.static(__dirname));
  // start the server
  const server = expressServer.listen(5555);
  // create the web socket
  wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false,
  });

  server.on("upgrade", onWsUpgrade);
  const port = (server.address() as any).port;

  console.info("Server running on port: ", port);

  return port;
}
