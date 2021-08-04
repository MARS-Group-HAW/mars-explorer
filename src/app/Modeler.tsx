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
import { startLanguageClient } from "./client";

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
        monaco.Uri.file(project.entryFilePath)
      ),
      glyphMargin: true,
      theme: "vs-dark",
      fontSize: 16,
      language: "csharp",
    });

    const rootUri = monaco.Uri.parse(project.rootPath).path;

    window.api.logger.debug({
      projectRootPath: project.rootPath,
      projectRootUri: monaco.Uri.parse(project.rootPath),
    })
    window.api.logger.debug({
      entryFilePath: project.entryFilePath,
      entryFileUri:         monaco.Uri.file(project.entryFilePath),
    });

    // install Monaco language client services
    MonacoServices.install(monaco as any, {
      rootUri,
    });

    await startLanguageClient();
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
