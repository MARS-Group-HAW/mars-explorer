import { useEffect } from "react";
import useLastProjectPath from "./use-last-project-path";
import useCheckForDotNet from "./use-check-for-dotnet";
import usePrepareModel from "./use-prepare-model";

type State = {};

function useApp(): State {
  useLastProjectPath();
  useCheckForDotNet();
  usePrepareModel();

  useEffect(() => window.api.logger.info("App mounted."), []);

  return {};
}

export default useApp;
