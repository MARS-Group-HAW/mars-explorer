import { useKey } from "react-use";
import { useCallback } from "react";

function useSaveKey(predicate: () => boolean, onSaveCb: () => void): void {
  const isSaveKey = useCallback(
    (event: KeyboardEvent) =>
      event.metaKey && event.key.toLowerCase() === "s" && predicate(),
    [predicate, onSaveCb]
  );

  useKey(isSaveKey, onSaveCb);
}

export default useSaveKey;
