import React, { useState } from "react";
import { editor } from "monaco-editor";
import monaco from "@app/standalone/monaco-editor/monaco";
import { useMount } from "react-use";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

type State = void;

function useEditor(containerRef: React.RefObject<HTMLDivElement>): State {
  const [, setMonacoEditor] = useState<IStandaloneCodeEditor>();

  useMount(
    () =>
      containerRef.current &&
      setMonacoEditor(monaco.editor.create(containerRef.current))
  );
}

export default useEditor;
