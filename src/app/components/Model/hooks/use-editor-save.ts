import { useKey } from "react-use";
import { useCallback } from "react";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectDirtyModels } from "../utils/model-slice";
import useSaveFile from "./use-save-file";

function useEditorSave(): void {
  const dirtyModels = useAppSelector(selectDirtyModels);

  const { saveCurrentFile } = useSaveFile();

  const isSaveKey = useCallback(
    (event: KeyboardEvent) =>
      event.metaKey &&
      event.key.toLowerCase() === "s" &&
      dirtyModels?.length > 0,
    [dirtyModels]
  );

  useKey(isSaveKey, saveCurrentFile);
}

export default useEditorSave;
