/* FIXME
    should be: monaco-editor/esm/vs/editor/editor.api";
    but leads to error on Service installation.
    https://github.com/TypeFox/monaco-languageclient/issues/274
 */
import { editor } from "monaco-editor";
import { MonacoLanguageClient, MonacoServices } from "monaco-languageclient";
import startLanguageClient from "./client";
import monaco from "./monaco";
import CSHARP from "./types";
import ITextModel = editor.ITextModel;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
// import "./snippets";
// import "./signature-helper";

// eslint-disable-next-line no-restricted-globals
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => "editor.worker.js",
};

monaco.languages.register(CSHARP);

monaco.languages.onLanguage(CSHARP.id, () => {
  console.log("lang loaded");
});

class Editor {
  private static editor: IStandaloneCodeEditor;

  private static monacoLanguageClient: MonacoLanguageClient;

  private static monacoService: MonacoServices;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static async create(
    container: HTMLElement,
    rootPath: string,
    model: {
      path: string;
      content: string;
    }
  ): Promise<void> {
    const newModel = this.createOrGetModel(model.path, model.content);

    if (!this.editor) {
      this.editor = monaco.editor.create(container, {
        model: newModel,
        glyphMargin: true,
        fontSize: 16,
      });
    } else {
      this.editor.setModel(newModel);
    }
    const rootUri = monaco.Uri.parse(rootPath).path;

    // install Monaco language client services

    if (!this.monacoService) {
      this.monacoService = MonacoServices.install(monaco, {
        rootUri,
      });
      // TODO monaco langauge client features methoden anschauen
    }

    if (!this.monacoLanguageClient) {
      this.monacoLanguageClient = await startLanguageClient(rootUri);

      // FIXME wait for ready
      return this.monacoLanguageClient.onReady();
    }

    return Promise.resolve();
  }

  private static createOrGetModel = (
    path: string,
    content: string
  ): ITextModel => {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    textModel = monaco.editor.createModel(content, CSHARP.id, modelUri);

    return textModel;
  };
}

export default Editor;
