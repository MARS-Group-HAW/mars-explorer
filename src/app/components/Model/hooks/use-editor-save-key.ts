import { useCallback } from "react";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectDirtyModels } from "../utils/model-slice";
import useSaveFile from "./use-save-file";
import useSaveKey from "../../../utils/hooks/use-save-key";

function useEditorSaveKey(): void {
  const dirtyModels = useAppSelector(selectDirtyModels);

  const { saveCurrentFile } = useSaveFile();

  const canBeSaved = useCallback(() => dirtyModels.length > 0, [dirtyModels]);

  useSaveKey(canBeSaved, saveCurrentFile);
}

export default useEditorSaveKey;
