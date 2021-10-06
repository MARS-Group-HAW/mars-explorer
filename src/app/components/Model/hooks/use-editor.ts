import React, { useCallback, useEffect, useState } from "react";
import { editor } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import { useLatest, useMount, useUnmount } from "react-use";
import CSHARP from "../../../standalone/monaco-editor/types";
import { useSharedModels } from "./use-shared-models";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  addToDirtyFiles,
  removeFromDirtyFiles,
  selectDirtyModels,
} from "../utils/model-slice";
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

type State = {};

function useEditor(containerRef: React.RefObject<HTMLDivElement>): State {
  const dispatch = useAppDispatch();
  const dirtyModels = useAppSelector(selectDirtyModels);
  const latestModels = useLatest(dirtyModels);
  const [{ selectedModel }] = useSharedModels();
  const [monacoEditor, setMonacoEditor] = useState<IStandaloneCodeEditor>();

  function createOrGetModel(path: string, content: string): ITextModel {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    textModel = monaco.editor.createModel(content, CSHARP.id, modelUri);

    return textModel;
  }

  useEffect(() => {
    if (!selectedModel) return () => {};

    const { path, content } = selectedModel;

    const newModel = createOrGetModel(path, content);
    monacoEditor?.setModel(newModel);
    const versionId = newModel.getAlternativeVersionId();

    const disposeable = newModel.onDidChangeContent(() => {
      const isSameVersion = newModel.getAlternativeVersionId() === versionId;
      const inDirtyModels = latestModels.current.includes(path);

      if (isSameVersion && inDirtyModels) {
        dispatch(removeFromDirtyFiles(path));
        return;
      }

      if (!isSameVersion && !inDirtyModels) {
        dispatch(addToDirtyFiles(path));
      }
    });

    return () => disposeable.dispose();
  }, [selectedModel]);

  useMount(
    () =>
      containerRef.current &&
      setMonacoEditor(monaco.editor.create(containerRef.current, monacoOptions))
  );

  useUnmount(() => monacoEditor.dispose());

  return {};
}

export default useEditor;
