import React, { useState } from "react";
import { editor, languages } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import { useMount } from "react-use";
import CSHARP from "../../../standalone/monaco-editor/types";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import ITextModel = editor.ITextModel;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

monaco.languages.register(CSHARP);

// eslint-disable-next-line no-restricted-globals
(self as any).MonacoEnvironment = {
  getWorkerUrl: () => "editor.worker.js",
};

const monacoOptions: IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
};

type State = {
  setModel: (path: string, content: string) => void;
};

function useEditor(containerRef: React.RefObject<HTMLDivElement>): State {
  const [monacoEditor, setMonacoEditor] = useState<IStandaloneCodeEditor>();

  useMount(
    () =>
      containerRef.current &&
      setMonacoEditor(monaco.editor.create(containerRef.current, monacoOptions))
  );

  function createOrGetModel(path: string, content: string): ITextModel {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    textModel = monaco.editor.createModel(content, CSHARP.id, modelUri);

    return textModel;
  }

  function setModel(path: string, content: string) {
    const newModel = createOrGetModel(path, content);
    monacoEditor?.setModel(newModel);
  }

  return {
    setModel,
  };
}

export default useEditor;
