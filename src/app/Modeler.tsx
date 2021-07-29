import * as React from "react";
import { Component } from "react";
/* FIXME
    should be: monaco-editor/esm/vs/editor/editor.api";
    but leads to error on Service installation.
    https://github.com/TypeFox/monaco-languageclient/issues/274
 */
import * as monaco from "monaco-editor";
import { MonacoServices } from "monaco-languageclient";
import { Channel } from "@shared/types/Channel";
import { Project } from "@shared/types/Project";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Client } from "./client";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    window.api.logger.info(
      `Getting worker URL (moduleId: ${moduleId}, label: ${label})`
    );
    return "editor.worker.js";
  },
};

export class Modeler extends Component {
  private client: Client;
  private static readonly MONACO_CONTAINER_ID = "monaco-container";

  async componentDidMount() {
    monaco.languages.register({
      id: "csharp",
      extensions: [".cs"],
      aliases: ["C#", "csharp"],
    });

    const exampleProject = await window.api.invoke<ExampleProject, Project>(
      Channel.GET_EXAMPLE_PROJECT,
      "MyTestApp"
    );

    await this.setupMonaco(exampleProject);

    const port = await window.api.invoke<void, number>(
      Channel.GET_WEBSOCKET_PORT
    );

    this.client = new Client(port);
  }

  private async setupMonaco(project: Project) {
    // FIXME: get example path from main
    const fileContents = await window.api.invoke<string, string>(
      Channel.READ_FILE,
      project.entryFilePath
    );

    monaco.editor.create(document.getElementById(Modeler.MONACO_CONTAINER_ID), {
      model: monaco.editor.createModel(
        fileContents,
        "csharp",
        monaco.Uri.parse(project.entryFilePath)
      ),
      glyphMargin: true,
      theme: "vs-dark",
      fontSize: 16,
      language: "csharp",
    });

    // install Monaco language client services
    MonacoServices.install(monaco as any, {
      rootUri: monaco.Uri.parse(project.rootPath).path,
    });
  }

  componentWillUnmount() {
    this.client.close();
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
