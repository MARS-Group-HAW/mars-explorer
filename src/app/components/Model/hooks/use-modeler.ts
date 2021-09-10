import { RefObject, useEffect } from "react";
import useEditor from "./use-editor";
import useSelectedModel from "./use-selected-model";
import useInstallMarsFramework from "./use-install-mars-framework";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

type State = {
  loadingMsg: string;
  showLoading: boolean;
};

function useModeler({ containerRef }: Props): State {
  useEditor(containerRef);
  useSelectedModel();
  const { isInstalling } = useInstallMarsFramework();

  return {
    loadingMsg: "Installing dependencies ...",
    showLoading: isInstalling,
  };
}

export default useModeler;
