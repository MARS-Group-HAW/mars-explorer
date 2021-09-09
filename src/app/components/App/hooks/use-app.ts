import { useEffect } from "react";
import useLastProjectPath from "./use-last-project-path";
import useCheckForDotNet from "./use-check-for-dotnet";

type State = {};

function useApp(): State {
  useLastProjectPath();
  useCheckForDotNet();

  useEffect(() => window.api.logger.info("App mounted."), []);

  return {};
}

export default useApp;
