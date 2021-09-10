import { RefObject } from "react";
import useEditor from "./use-editor";
import useSelectedModel from "./use-selected-model";
import { useAppSelector } from "../../../utils/hooks/use-store";
import { LoadingState, selectProject } from "../../Home/utils/project-slice";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

type State = {
  loadingMsg: string;
  showLoading: boolean;
};

/*
const EDITOR_LOADING_MSG = "Starting Language Server ...";
const INSTALLING_MSG = "Installing dependencies ...";
const BOTH_MSG = `${EDITOR_LOADING_MSG} & ${INSTALLING_MSG}`;
 */

function useModeler({ containerRef }: Props): State {
  const { loadingState } = useAppSelector(selectProject);

  useEditor(containerRef);
  useSelectedModel();

  return {
    loadingMsg: "Loading ...",
    showLoading: loadingState !== LoadingState.FINISHED,
  };
}

export default useModeler;
