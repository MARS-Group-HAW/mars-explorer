import { IFileRef } from "@shared/types/File";
import { useEffect } from "react";
import { useDeepCompareEffect } from "react-use";
import useCsvList from "./use-csv-list";
import useResultDataPerObject from "./use-result-data-per-object";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  resetAll,
  selectAnalyzeData,
  selectLoadingFiles,
  setResultFiles,
} from "../utils/analyze-slice";

type State = {
  files: IFileRef[];
  selectedFiles: IFileRef[];
  toggleFile: (file: IFileRef) => void;
  showListLoading: boolean;
  isFileChecked: (fileName: string) => boolean;
  isFileLoading: (fileName: string) => boolean;
};

function useAnalyze(): State {
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectAnalyzeData);
  const loadingFiles = useAppSelector(selectLoadingFiles);

  useDeepCompareEffect(
    () => window.api.logger.info(loadingFiles),
    [loadingFiles]
  );

  const { loading, files, selectedFiles, toggleFile, isFileSelected } =
    useCsvList();

  useEffect(() => {
    dispatch(resetAll());
    dispatch(setResultFiles({ files }));
  }, [files]);

  const { fetchData, abortFetching } = useResultDataPerObject();

  const handleToggle = (file: IFileRef) => {
    const isSelected = isFileSelected(file);
    const currentData = data[file.name];

    if (!isSelected && currentData?.data.length === 0) {
      fetchData(file);
    } else if (isSelected && currentData?.isLoading) {
      abortFetching(file);
    }

    toggleFile(file);
  };

  const isFileChecked = (fileName: string) =>
    Boolean(selectedFiles.find((file) => file.name === fileName));
  const isFileLoading = (fileName: string) => loadingFiles.includes(fileName);

  return {
    files,
    selectedFiles,
    toggleFile: handleToggle,
    isFileLoading,
    isFileChecked,
    showListLoading: loading,
  };
}

export default useAnalyze;
