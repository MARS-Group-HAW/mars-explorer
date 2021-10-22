import { useAppSelector } from "../../../../../utils/hooks/use-store";
import { selectProjectPath } from "../../../../Home/utils/project-slice";
import useMarsFramework from "./use-mars-framework";
import useMonacoServices from "./use-monaco-services";
import useLanguageClient from "./use-language-client";
import useModels from "./use-models";
import useProjectRestore from "./use-project-restore";

type State = void;

function useModelBootstrap(): State {
  const path = useAppSelector(selectProjectPath);

  useMarsFramework(path);
  useProjectRestore(path);
  useMonacoServices();
  useLanguageClient(path);
  useModels();
}

export default useModelBootstrap;
