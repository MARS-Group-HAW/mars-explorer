import { MutableRefObject, useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import { useUnmount } from "react-use";
import _ from "lodash";
import { CSHARP, MARKDOWN } from "../../../standalone/monaco-editor/types";
import { useSharedModels } from "./use-shared-models";
import useEditorDecorations from "./use-editor-decorations";
import useEditorSaveKey from "./use-editor-save-key";
import useDirtyFileHandler from "./use-dirty-file-handler";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import ITextModel = editor.ITextModel;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

monaco.languages.register(CSHARP);
monaco.languages.register(MARKDOWN);

// eslint-disable-next-line no-restricted-globals
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => "editor.worker.js",
};

const monacoOptions: IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  lightbulb: {
    enabled: true,
  },
};

type State = {
  ref: MutableRefObject<HTMLDivElement>;
};

function useEditor(): State {
  const ref = useRef();
  const [{ selectedModel, isExampleProject }] = useSharedModels();
  const [monacoEditor, setMonacoEditor] = useState<IStandaloneCodeEditor>();
  useEditorDecorations();
  useEditorSaveKey();
  useDirtyFileHandler();

  function createOrGetModel(path: string, content: string): ITextModel {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    const lang = _.last(path.split("."));

    if (!lang) {
      throw new Error(`No language for ${path} found.`);
    }

    textModel = monaco.editor.createModel(
      content,
      lang === "cs" ? CSHARP.id : MARKDOWN.id,
      modelUri
    );

    return textModel;
  }

  useEffect(() => {
    if (!selectedModel) {
      monacoEditor?.setModel(null);
      return;
    }

    const { path, content } = selectedModel;

    const newModel = createOrGetModel(path, content);
    monacoEditor?.setModel(newModel);
  }, [selectedModel]);

  useEffect(
    () =>
      ref.current &&
      setMonacoEditor(monaco.editor.create(ref.current, monacoOptions)),
    [ref]
  );

  useEffect(
    () => monacoEditor?.updateOptions({ readOnly: isExampleProject }),
    [isExampleProject]
  );

  useUnmount(() => monacoEditor.dispose());

  return { ref };
}

export default useEditor;
