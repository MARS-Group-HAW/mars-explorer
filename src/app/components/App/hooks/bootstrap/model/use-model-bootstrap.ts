import { useAppSelector } from "../../../../../utils/hooks/use-store";
import { selectProjectPath } from "../../../../Home/utils/project-slice";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import useModels from "./use-models";
import useExampleProjects from "./use-example-projects";

type State = void;

function useModelBootstrap(): State {
  const path = useAppSelector(selectProjectPath);

  useMarsFramework(path);
  useMonacoServices();
  useLanguageClient(path);
  useModels();
  useExampleProjects();
}

export default useModelBootstrap;
