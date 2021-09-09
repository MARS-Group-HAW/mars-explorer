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
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
// import "./snippets";
// import "./signature-helper";

// eslint-disable-next-line no-restricted-globals
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => "editor.worker.js",
};

monaco.languages.register(CSHARP);

monaco.languages.onLanguage(CSHARP.id, () => {
  // TODO: setup which only needs to be done on startup
  console.log("lang loaded");
});

const MONACO_OPTIONS: IStandaloneEditorConstructionOptions = {
  // glyphMargin: true,
  fontSize: 16,
};

class Editor {
  private static editor: IStandaloneCodeEditor;

  private static monacoLanguageClient: MonacoLanguageClient;

  private static monacoService: MonacoServices;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static async create(
    container: HTMLElement,
    rootPath: string
  ): Promise<void> {
    this.editor = monaco.editor.create(container, MONACO_OPTIONS);

    const rootUri = monaco.Uri.parse(rootPath).path;

    if (!this.monacoService) {
      this.monacoService = MonacoServices.install(monaco, {
        rootUri,
      });
    }

    if (!this.monacoLanguageClient) {
      this.monacoLanguageClient = await startLanguageClient(rootUri);

      // FIXME wait for ready
      return this.monacoLanguageClient.onReady();
    }

    return Promise.resolve();
  }

  public static setModel(path: string, content: string) {
    const newModel = Editor.createOrGetModel(path, content);
    Editor.editor.setModel(newModel);

    // TODO: get errors from markers
    monaco.editor.getModels().forEach((model) =>
      console.log(
        monaco.editor.getModelMarkers({
          resource: model.uri,
        })
      )
    );
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
