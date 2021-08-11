import { RefObject, useEffect } from "react";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Project } from "@shared/types/Project";
import { Channel } from "@shared/types/Channel";
import Editor from "../../../standalone/monaco-editor/Editor";
import { PageProps } from "../../../util/types/Navigation";

type State = void;

type Props = PageProps & {
  containerRef: RefObject<HTMLDivElement>;
};

function useModeler({ setLoading, containerRef }: Props): State {
  const setupMonaco = async (project: Project) => {
    // FIXME: get example path from main
    const fileContents = await window.api.invoke<string, string>(
      Channel.READ_FILE,
      project.entryFilePath
    );

    await Editor.create(containerRef.current, project, fileContents);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const exampleProject = await window.api.invoke<ExampleProject, Project>(
        Channel.GET_EXAMPLE_PROJECT,
        "MyTestApp"
      );

      await setupMonaco(exampleProject);
    };

    fetchData();
  }, []);
}

export default useModeler;
