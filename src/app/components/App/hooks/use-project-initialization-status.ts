import { useRef } from "react";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { selectProjectInitializationStatus } from "../../Home/utils/project-slice";

type State = {
  isProjectFullyInitialized: boolean;
};

function useProjectInitializationStatus(): State {
  const projectFullyLoaded = useAppSelector(selectProjectInitializationStatus);
  const stateRef = useRef<boolean>();
  stateRef.current = projectFullyLoaded;

  return {
    isProjectFullyInitialized: stateRef.current,
  };
}

export default useProjectInitializationStatus;
