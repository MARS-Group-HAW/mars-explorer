import { useBoolean, useSet } from "react-use";
import { useEffect, useState } from "react";
import { IFileRef } from "@shared/types/File";
import { Channel } from "@shared/types/Channel";
import { selectProject } from "../../Home/utils/project-slice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectSimulationFinishedStatus } from "../../QuickStartBar/utils/simulation-slice";

export type UseCsvListState = {
  loading: boolean;
  files: IFileRef[];
  selectedFiles: IFileRef[];
  toggleFile: (file: IFileRef) => void;
  isFileSelected: (file: IFileRef) => boolean;
};

function useCsvList(): UseCsvListState {
  const { path } = useAppSelector(selectProject);
  const hasSimulationFinished = useAppSelector(selectSimulationFinishedStatus);

  const [files, setFiles] = useState<IFileRef[]>([]);
  const [selectedFiles, { toggle, reset, has }] = useSet<IFileRef>(new Set([]));
  const [fetching, setFetching] = useBoolean(false);

  function fetchLatestResults() {
    if (!path) {
      window.api.logger.warn(
        "Analysis-Page accessed even though no project is currently selected. This should not happen."
      );
      return;
    }
    setFetching(true);
    window.api
      .invoke<string, IFileRef[]>(Channel.GET_CSV_RESULTS, path)
      .then((rawFiles) => {
        setFiles(rawFiles);
        reset();
      })
      .finally(() => setFetching(false));
  }

  useEffect(fetchLatestResults, [hasSimulationFinished, path]);

  return {
    loading: fetching,
    files,
    selectedFiles: Array.from(selectedFiles),
    toggleFile: toggle,
    isFileSelected: has,
  };
}

export default useCsvList;
