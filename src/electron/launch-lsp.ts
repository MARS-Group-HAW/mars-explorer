/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
// import * as fs from 'fs';
import * as rpc from '@codingame/monaco-jsonrpc';
import * as server from '@codingame/monaco-jsonrpc/lib/server';


import {
    InitializeRequest, InitializeParams,
    DidOpenTextDocumentNotification, DidOpenTextDocumentParams
} from 'vscode-languageserver';
import config, {SERVER_NAMES} from "./config";

export function launch(socket: rpc.IWebSocket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    console.log('connecting')

    // start the language server as an external process
    // @ts-ignore
    const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
    const connectTo = config[SERVER_NAMES.LOCAL_JNV];
    const serverConnection = server.createServerProcess(
        SERVER_NAMES.LOCAL_JNV,
        connectTo.command,
        connectTo.args,
    );
    server.forward(socketConnection, serverConnection, message => {
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
                    console.log('Opening', uri, text);
                    // if (uri) fs.writeFileSync(uri.replace('file://', ''), text)
                    break;
                }
            }
        }

        // console.info(`GOT MESSAGE: `, message.jsonrpc, message)

        return message;
    });

}
