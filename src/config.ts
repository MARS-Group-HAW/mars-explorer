import {DocumentSelector} from "monaco-languageclient";
import * as path from "path";

type Server = {
    command: string;
    workingDirectory: string;
    language: string;
    args: string[];
    documentSelector: DocumentSelector
}

export type ServerMap = { [name: string]: Server };


// Sample Server: '/Users/jvoss/Projects/temp/csharp-language-server-protocol/sample/SampleServer/bin/Debug/netcoreapp3.1/osx-x64/SampleServer',
const Servers: ServerMap = {
    omnisharp: {
        command: '/opt/omnisharp/run',
        workingDirectory: path.resolve(__dirname, '..', 'csharp-workspace'),
        args: ['-lsp', '-debug'],
        language: 'csharp',
        documentSelector: [{
            pattern: "**/*.cs"
        }]
    }
}

export default Servers;
