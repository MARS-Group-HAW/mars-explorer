import { useEffect } from "react";
import useLastProjectPath from "./use-last-project-path";
import useCheckForDotNet from "./use-check-for-dotnet";
import useBootstrap from "./bootstrap";

type State = void;

function useApp(): State {
  useBootstrap();
  useLastProjectPath();
  useCheckForDotNet();

  useEffect(() => window.api.logger.info("App mounted."), []);
}

export default useApp;
