import * as React from "react";
import {Component} from "react";
import * as monaco from "monaco-editor-core";
import {MonacoServices} from "monaco-languageclient";
import './client';
import {Channel} from "../shared/types/Channel";

(self as any).MonacoEnvironment = {
    getWorkerUrl: function (moduleId: string, label: string) {
        if (label === 'json') {
            return 'json.worker.js';
        }
        return 'editor.worker.js';
    }
}

export class Modeler extends Component {

    private static readonly MONACO_CONTAINER_ID = 'monaco-container';

    async componentDidMount(): Promise<void> {
        monaco.languages.register({
            id: 'csharp',
            extensions: ['.cs'],
            aliases: ['C#', 'csharp'],
        });

        window.api.invoke(Channel.GET_WORKSPACE_PATH).then(console.log)

        // console.log('Workspace: ', remote.getGlobal('workspace'));

        const folderPath = '/Users/jvoss/Projects/master-thesis/mars-life/Explorer/.webpack/renderer/workspace';

        // const csFile = await fetch('/workspace/Solution.cs');
        // const csFile = await fetch(folderPath + '/Solution.cs');
        // const csFileText = await csFile.text();

        // const uri = 'file:///workspace';

        monaco.editor.create(document.getElementById(Modeler.MONACO_CONTAINER_ID)!, {
            model: monaco.editor.createModel(
                `using System;

class Solution {
    static void Main(String[] args) {

    }
}
`,
                'csharp',
                // monaco.Uri.parse(`${uri}/Solution.cs`)
                monaco.Uri.parse(`${folderPath}/Solution.cs`)
            ),
            glyphMargin: true,
            theme: 'vs-dark',
            fontSize: 16,
            language: 'csharp',
        });

        // install Monaco language client services
        MonacoServices.install(monaco, {rootUri: monaco.Uri.parse(`${folderPath}`).path});
    }

    render() {
        return <div style={{height: '100%', width: '100%'}} id={Modeler.MONACO_CONTAINER_ID}/>
    }
}
