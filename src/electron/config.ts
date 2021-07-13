import {DocumentSelector} from "monaco-languageclient";
import * as path from "path";

export enum SERVER_NAMES {
    LOCAL_JNV = "LOCAL_JNV"
}

type Server = {
    command: string;
    workingDirectory: string;
    language: string;
    args: string[];
    documentSelector: DocumentSelector
}

export type ServerMap = { [key in keyof typeof SERVER_NAMES]: Server };


// Sample Server: '/Users/jvoss/Projects/temp/csharp-language-server-protocol/sample/SampleServer/bin/Debug/netcoreapp3.1/osx-x64/SampleServer',
const Servers: ServerMap = {
    [SERVER_NAMES.LOCAL_JNV]: {
        command: 'bash',
        workingDirectory: path.resolve(__dirname, '..', '.webpack', 'renderer', 'workspace'),
        args: [
            '/Users/jvoss/Projects/master-thesis/temp/omnisharp/omnisharp-osx/run',
            '-lsp',
            '-debug', // TODO: maybe delete -debug?
            'script:enabled=false',
            'cake:enabled=false'
        ],
        language: 'csharp',
        documentSelector: [{
            pattern: "**/*.cs"
        }]
    }
}

export default Servers;
