import { MutableRefObject, useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import { useLatest, useUnmount } from "react-use";
import _ from "lodash";
import { CSHARP, MARKDOWN } from "../../../standalone/monaco-editor/types";
import { useSharedModels } from "./use-shared-models";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  addToDirtyFiles,
  removeFromDirtyFiles,
  selectDirtyModels,
} from "../utils/model-slice";
import useEditorDecorations from "./use-editor-decorations";
import useEditorSaveKey from "./use-editor-save-key";
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
  const dispatch = useAppDispatch();
  const dirtyModels = useAppSelector(selectDirtyModels);
  const latestModels = useLatest(dirtyModels);
  const [{ selectedModel, isExampleProject }] = useSharedModels();
  const [monacoEditor, setMonacoEditor] = useState<IStandaloneCodeEditor>();
  useEditorDecorations();
  useEditorSaveKey();

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
    if (!selectedModel) return () => {};

    const { path, name, content } = selectedModel;

    const newModel = createOrGetModel(path, content);
    monacoEditor?.setModel(newModel);

    const versionId = newModel.getAlternativeVersionId();

    const disposeable = newModel.onDidChangeContent(() => {
      const isSameVersion = newModel.getAlternativeVersionId() === versionId;
      const inDirtyModels = latestModels.current.includes(name);

      if (isSameVersion && inDirtyModels) {
        dispatch(removeFromDirtyFiles(name));
        return;
      }

      if (!isSameVersion && !inDirtyModels) {
        dispatch(addToDirtyFiles(name));
      }
    });

    return () => disposeable.dispose();
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
