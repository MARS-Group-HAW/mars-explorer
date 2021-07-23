import * as React from "react";
import { Component } from "react";
/* FIXME
    should be: monaco-editor/esm/vs/editor/editor.api";
    but leads to error on Service installation.
    https://github.com/TypeFox/monaco-languageclient/issues/274
 */
import * as monaco from "monaco-editor";
import { MonacoServices } from "monaco-languageclient";
import "./client";
import { Channel } from "@shared/types/Channel";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return "editor.worker.js";
  },
};

export class Modeler extends Component {
  private static readonly MONACO_CONTAINER_ID = "monaco-container";

  componentDidMount(): void {
    monaco.languages.register({
      id: "csharp",
      extensions: [".cs"],
      aliases: ["C#", "csharp"],
    });

    window.api
      .invoke<string>(Channel.GET_WORKSPACE_PATH)
      .then((workspacePath) => this.setupMonaco(workspacePath))
      .catch((e) =>
        console.error(
          "Something went wrong while getting the workspace path: ",
          e
        )
      );
  }

  private async setupMonaco(folderPath: string) {
    const startFile = `${folderPath}/MyTestApp/Program.cs`;
    const fileContents = await window.api.invoke<string>(
      Channel.READ_FILE,
      startFile
    );

    monaco.editor.create(document.getElementById(Modeler.MONACO_CONTAINER_ID), {
      model: monaco.editor.createModel(
        fileContents,
        "csharp",
        monaco.Uri.parse(startFile)
      ),
      glyphMargin: true,
      theme: "vs-dark",
      fontSize: 16,
      language: "csharp",
    });

    // install Monaco language client services
    MonacoServices.install(monaco as any, {
      rootUri: monaco.Uri.parse(`${folderPath}/MyTestApp/`).path,
    });
  }

  render() {
    return (
      <div
        style={{ height: "100%", width: "100%" }}
        id={Modeler.MONACO_CONTAINER_ID}
      />
    );
  }
}
