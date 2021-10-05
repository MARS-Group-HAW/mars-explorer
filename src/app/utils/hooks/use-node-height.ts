import { useCallback, useState } from "react";

type State = {
  height: number;
  ref: (node: HTMLElement) => void;
};

function useNodeHeight(): State {
  const [height, setHeight] = useState(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return {
    height,
    ref,
  };
}

export default useNodeHeight;
