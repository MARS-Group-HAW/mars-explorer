import { useEffect } from "react";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectModel } from "../utils/model-slice";
import Editor from "../../../standalone/monaco-editor/Editor";

function useSelectedModel() {
  const { path: modelPath, content } = useAppSelector(selectModel);

  useEffect(() => {
    if (modelPath) {
      Editor.setModel(modelPath, content);
    }
  }, [modelPath]);
}

export default useSelectedModel;
