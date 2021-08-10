/* FIXME
    should be: monaco-editor/esm/vs/editor/editor.api";
    but leads to error on Service installation.
    https://github.com/TypeFox/monaco-languageclient/issues/274
 */
import { editor } from "monaco-editor";
import { MonacoLanguageClient, MonacoServices } from "monaco-languageclient";
import { Project } from "@shared/types/Project";
import ITextModel = editor.ITextModel;
import startLanguageClient from "./client";
import monaco from "./monaco";
import registerAll from "./snippets";

// eslint-disable-next-line no-restricted-globals
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => "editor.worker.js",
};

monaco.languages.register({
  id: "csharp",
  extensions: [".cs"],
  aliases: ["C#", "csharp"],
});

class Editor {
  private static monacoLanguageClient: MonacoLanguageClient;

  private static monacoService: MonacoServices;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static async create(
    container: HTMLElement,
    project: Project,
    content: string
  ): Promise<void> {
    monaco.editor.create(container, {
      model: this.createOrGetModel(project.entryFilePath, content),
      glyphMargin: true,
      // theme: "vs-dark",
      fontSize: 16,
      language: "csharp",
    });

    const rootUri = monaco.Uri.parse(project.rootPath).path;

    // install Monaco language client services
    this.monacoService = MonacoServices.install(monaco, {
      rootUri,
    });

    registerAll(this.monacoService);

    if (!this.monacoLanguageClient) {
      this.monacoLanguageClient = await startLanguageClient();
    }
  }

  private static createOrGetModel = (
    path: string,
    content: string
  ): ITextModel => {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    textModel = monaco.editor.createModel(content, "csharp", modelUri);

    return textModel;
  };
}

export default Editor;
