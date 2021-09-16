import { useRef } from "react";
import { useAppSelector } from "../../../../../utils/hooks/use-store";
import { selectModelFullyInitialized } from "../../../../Model/utils/model-slice";

type State = {
  isProjectFullyInitialized: boolean;
};

function useProjectInitializationStatus(): State {
  const projectFullyLoaded = useAppSelector(selectModelFullyInitialized);
  const stateRef = useRef<boolean>();
  stateRef.current = projectFullyLoaded;

  return {
    isProjectFullyInitialized: stateRef.current,
  };
}

export default useProjectInitializationStatus;
