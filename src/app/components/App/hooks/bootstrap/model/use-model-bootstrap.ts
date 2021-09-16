import { useAppSelector } from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import useProjectInitialization from "./use-project-initialization";

type State = void;

function useModelBootstrap(): State {
  const { path } = useAppSelector(selectProject);

  useMarsFramework(path);
  useMonacoServices(path);
  useLanguageClient(path);
  useProjectInitialization(path);
}

export default useModelBootstrap;
