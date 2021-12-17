import { useEffect } from "react";
import { Message, NotificationMessage } from "vscode-jsonrpc";
import { isNotificationMessage } from "vscode-jsonrpc/lib/common/messages";
import {
  Diagnostic,
  PublishDiagnosticsParams,
} from "@codingame/monaco-languageclient";
import { DiagnosticSeverity } from "vscode-languageserver";
import { useLatest } from "react-use";
import { Uri } from "monaco-editor";
import uriToFsPath from "@app/utils/uri-to-fs-path";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProjectPath } from "../../../../Home/utils/project-slice";
import {
  resetErrors,
  selectModelFullyInitialized,
  selectModelsPathWithError,
  setErrorStateInModel,
} from "../../../../Model/utils/model-slice";

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
  const projectPath = useAppSelector(selectProjectPath);
  const errors = useAppSelector(selectModelsPathWithError);
  const latestErrors = useLatest(errors);

  const initialized = useAppSelector(selectModelFullyInitialized);
  const latestInitialized = useLatest(initialized);

  const dispatch = useAppDispatch();

  const resetDiagnostics = () => {
    dispatch(resetErrors());
  };

  useEffect(resetDiagnostics, [projectPath]);

  async function handleMessage(msg: Message) {
    if (!latestInitialized.current) return;

    if (isNotificationMessage(msg) && isDiagnosticMessage(msg)) {
      const diagnosticParams = msg.params as PublishDiagnosticsParams;

      if (isAssembly(diagnosticParams.uri)) return;

      const diagnosticErrors =
        diagnosticParams.diagnostics.filter(diagnosticIsError);

      const { uri } = diagnosticParams;
      const path = uriToFsPath(Uri.parse(uri));

      const isInErrors = latestErrors.current.includes(path);

      if (diagnosticErrors.length > 0 && !isInErrors) {
        dispatch(
          setErrorStateInModel({
            path,
            isErroneous: true,
          })
        );
        return;
      }

      if (diagnosticErrors.length === 0 && isInErrors) {
        dispatch(
          setErrorStateInModel({
            path,
            isErroneous: false,
          })
        );
      }
    }
  }

  return {
    handleMessage,
  };
}

export default useDiagnosticsMessages;
