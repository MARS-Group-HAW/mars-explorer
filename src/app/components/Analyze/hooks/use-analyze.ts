import { useEffect, useMemo } from "react";
import { useUnmount } from "react-use";
import useCsvList from "./use-csv-list";
import useResultDataPerObject from "./use-result-data-per-object";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  resetAll,
  resetData,
  selectAnalyzeData,
  selectLoadingFiles,
  setResultFiles,
} from "../utils/analyze-slice";

type SelectableFiles = {
  name: string;
  isChecked: boolean;
  isLoading: boolean;
  isDisabled: boolean;
}[];

type State = {
  files: SelectableFiles;
  selectedFileNames: string[];
  toggleFile: (fileName: string) => void;
  showListLoading: boolean;
};

function useAnalyze(): State {
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectAnalyzeData);
  const loadingFiles = useAppSelector(selectLoadingFiles);
  const isAnyFileLoading = useMemo(
    () => loadingFiles.length > 0,
    [loadingFiles]
  );

  const { loading, files, selectedFiles, toggleFile } = useCsvList();

  useUnmount(() =>
    loadingFiles.forEach((name) => dispatch(resetData({ name })))
  );

  useEffect(() => {
    dispatch(resetAll());
    dispatch(setResultFiles({ files }));
  }, [files]);

  const { fetchData, abortFetching } = useResultDataPerObject();

  const isFileSelected = (fileName: string) =>
    Boolean(selectedFiles.find((file) => file.name === fileName));

  const handleToggle = (fileName: string) => {
    const isSelected = isFileSelected(fileName);
    const fileRef = files.find((file) => file.name === fileName);
    const currentData = data[fileName];

    if (!isSelected && currentData?.data.length === 0) {
      fetchData(fileRef);
    } else if (isSelected && currentData?.isLoading) {
      abortFetching(fileName);
    }

    toggleFile(fileRef);
  };

  const fileWithMeta = files.map(({ name }) => {
    const isLoading = loadingFiles.includes(name);

    return {
      name,
      isLoading,
      isDisabled: isAnyFileLoading && !isLoading,
      isChecked: isFileSelected(name),
    };
  });

  const selectedFileNames = fileWithMeta
    .filter((file) => file.isChecked)
    .map((file) => file.name);

  return {
    files: fileWithMeta,
    selectedFileNames,
    toggleFile: handleToggle,
    showListLoading: loading,
  };
}

export default useAnalyze;
