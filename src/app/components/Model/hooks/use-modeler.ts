import { RefObject, useEffect } from "react";
import { useAsync } from "react-use";
import { selectProject } from "@app/components/Home/utils/project-slice";
import { PageProps } from "@app/util/types/Navigation";
import { selectModel } from "@app/components/Model/utils/model-slice";
import Editor from "../../../standalone/monaco-editor/Editor";
import { useAppSelector } from "../../App/hooks/use-store";

type Props = PageProps & {
  containerRef: RefObject<HTMLDivElement>;
};

function useModeler({ setLoading, containerRef }: Props) {
  const projectRef = useAppSelector(selectProject);
  const model = useAppSelector(selectModel);

  useAsync(async () => {
    await Editor.create(containerRef.current, projectRef.path);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (model) {
      Editor.setModel(model.path, model.content);
    }
  }, [model]);
}

export default useModeler;
