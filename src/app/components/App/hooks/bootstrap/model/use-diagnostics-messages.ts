import { useEffect } from "react";
import { Message, NotificationMessage } from "vscode-jsonrpc";
import { isNotificationMessage } from "vscode-jsonrpc/lib/common/messages";
import { Diagnostic, PublishDiagnosticsParams } from "monaco-languageclient";
import { DiagnosticSeverity } from "vscode-languageserver";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import {
  removeErrorsInPath,
  resetErrors,
  setErrorsInPath,
} from "../../../../Model/utils/model-slice";
import useProjectInitializationStatus from "./use-project-initialization-status";

type State = {
  handleMessage: (msg: Message) => void;
};

const isDiagnosticMessage = (msg: NotificationMessage): boolean =>
  msg.method === "textDocument/publishDiagnostics";

// FIXME is quickfix, omnisharp should ignore these
const isAssembly = (uri: string): boolean =>
  uri.endsWith("AssemblyAttributes.cs") || uri.endsWith("AssemblyInfo.cs");

const diagnosticIsError = (diagnostic: Diagnostic): boolean =>
  diagnostic.severity === DiagnosticSeverity.Error;

function useDiagnosticsMessages(): State {
  const { path } = useAppSelector(selectProject);
  const { isProjectFullyInitialized } = useProjectInitializationStatus();

  const dispatch = useAppDispatch();

  const resetDiagnostics = () => {
    dispatch(resetErrors);
  };

  useEffect(resetDiagnostics, [path]);

  function handleMessage(msg: Message) {
    if (isProjectFullyInitialized) return;

    if (isNotificationMessage(msg) && isDiagnosticMessage(msg)) {
      const diagnosticParams = msg.params as PublishDiagnosticsParams;

      if (isAssembly(diagnosticParams.uri)) return;

      const diagnosticErrors =
        diagnosticParams.diagnostics.filter(diagnosticIsError);

      const { uri } = diagnosticParams;

      if (diagnosticErrors.length > 0) {
        dispatch(setErrorsInPath(uri));
      } else {
        dispatch(removeErrorsInPath(uri));
      }
    }
  }

  return {
    handleMessage,
  };
}

export default useDiagnosticsMessages;
