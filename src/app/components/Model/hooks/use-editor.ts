import React, { useEffect, useState } from "react";
import { editor } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import {
  useCustomCompareEffect,
  useLatest,
  useMount,
  useSet,
  useUnmount,
} from "react-use";
import _ from "lodash";
import CSHARP from "../../../standalone/monaco-editor/types";
import { useSharedModels } from "./use-shared-models";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectDirtyModels, setDirtyModels } from "../utils/model-slice";
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
  const [{ selectedModel }] = useSharedModels();
  const [monacoEditor, setMonacoEditor] = useState<IStandaloneCodeEditor>();

  const [set, { add, remove }] = useSet(new Set([]));

  useMount(() => dirtyModels && dirtyModels.forEach((model) => add(model)));

  const latestAdd = useLatest(add);
  const latestRemove = useLatest(remove);

  function createOrGetModel(path: string, content: string): ITextModel {
    const modelUri = monaco.Uri.file(path);

    let textModel = monaco.editor.getModel(modelUri);

    if (textModel) return textModel;

    textModel = monaco.editor.createModel(content, CSHARP.id, modelUri);

    return textModel;
  }

  useEffect(() => {
    if (!selectedModel) return () => {};

    const { name, path, content } = selectedModel;

    const newModel = createOrGetModel(path, content);
    monacoEditor?.setModel(newModel);
    const versionId = newModel.getAlternativeVersionId();

    const disposeable = newModel.onDidChangeContent(() => {
      if (newModel.getAlternativeVersionId() === versionId) {
        latestRemove.current(name);
      } else {
        latestAdd.current(name);
      }
    });

    return () => disposeable.dispose();
  }, [selectedModel]);

  useCustomCompareEffect(
    () => {
      dispatch(setDirtyModels(Array.from(set)));
    },
    [set],
    (prevDeps, nextDeps) => {
      const prevSet = prevDeps[0];
      const nextSet = nextDeps[0];

      if (!prevSet || !nextSet || prevSet.size !== nextSet.size) return false;

      return (
        _.difference(Array.from(prevSet), Array.from(nextSet)).length === 0
      );
    }
  );

  useMount(
    () =>
      containerRef.current &&
      setMonacoEditor(monaco.editor.create(containerRef.current, monacoOptions))
  );

  useUnmount(() => monacoEditor.dispose());

  return {};
}

export default useEditor;
