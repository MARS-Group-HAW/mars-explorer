import { editor } from "monaco-editor";
import { useLatest, useMount } from "react-use";
import uriToFsPath from "@app/utils/uri-to-fs-path";
import {
  selectModelVersionByPath,
  setDirtyStateInModel,
} from "../utils/model-slice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";

function useDirtyFileHandler() {
  const dispatch = useAppDispatch();
  const modelPathsWithVersion = useAppSelector(selectModelVersionByPath);
  const latestModelPathsWithVersion = useLatest(modelPathsWithVersion);

  useMount(() => {
    const didCreateDisposable = editor.onDidCreateModel((model) => {
      const modelPath = uriToFsPath(model.uri);
      const didContentChangeDisposable = model.onDidChangeContent(() => {
        const latestVersion = latestModelPathsWithVersion.current[modelPath];
        const currentVersion = model.getAlternativeVersionId();

        dispatch(
          setDirtyStateInModel({
            path: modelPath,
            isDirty: latestVersion !== currentVersion,
          })
        );

        return () => didContentChangeDisposable.dispose();
      });

      return () => didCreateDisposable.dispose();
    });
  });
}

export default useDirtyFileHandler;
