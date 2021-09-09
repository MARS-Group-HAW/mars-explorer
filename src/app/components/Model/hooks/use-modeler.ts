import { RefObject, useEffect } from "react";
import { useAsync } from "react-use";
import { selectProject } from "@app/components/Home/utils/project-slice";
import { selectModel } from "@app/components/Model/utils/model-slice";
import Editor from "../../../standalone/monaco-editor/Editor";
import { useAppSelector } from "../../../utils/hooks/use-store";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

function useModeler({ containerRef }: Props) {
  const { path } = useAppSelector(selectProject);
  const { path: modelPath, content } = useAppSelector(selectModel);

  useAsync(async () => {
    if (path) {
      await Editor.create(containerRef.current, path);
    }
  }, [path]);

  useEffect(() => {
    if (modelPath) {
      Editor.setModel(modelPath, content);
    }
  }, [modelPath]);
}

export default useModeler;
