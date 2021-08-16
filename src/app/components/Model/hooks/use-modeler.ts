import { RefObject, useEffect, useState } from "react";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Project } from "@shared/types/Project";
import { Channel } from "@shared/types/Channel";
import { ModelRef } from "@shared/types/Model";
import Editor from "../../../standalone/monaco-editor/Editor";
import { PageProps } from "../../../util/types/Navigation";

type State = {
  models: ModelRef[];
};

type Props = PageProps & {
  containerRef: RefObject<HTMLDivElement>;
};

function useModeler({ setLoading, containerRef }: Props): State {
  const [models, setModels] = useState<ModelRef[]>([]);

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
      const exampleModels = await window.api.invoke<void, ModelRef[]>(
        Channel.GET_EXAMPLE_PROJECTS
      );
      setModels(exampleModels);
    };

    fetchData();
  }, []);

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

  return { models };
}

export default useModeler;
