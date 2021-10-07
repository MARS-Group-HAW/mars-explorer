import { MutableRefObject } from "react";
import useEditor from "../../hooks/use-editor";

type State = {
  monacoContainerRef: MutableRefObject<HTMLDivElement>;
};

function useModelerContainer(): State {
  const { ref } = useEditor();

  return {
    monacoContainerRef: ref,
  };
}

export default useModelerContainer;
