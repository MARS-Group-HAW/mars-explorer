import { IFileRef } from "@shared/types/File";
import { useEffect, useMemo } from "react";
import _ from "lodash";
import useCsvList from "./use-csv-list";
import { ResultDataPerObject } from "../utils/ResultData";
import useResultDataPerObject from "./use-result-data-per-object";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import {
  resetAll,
  selectAnalyzeData,
  setResultFiles,
} from "../utils/analyze-slice";

type State = {
  files: IFileRef[];
  selectedFiles: IFileRef[];
  toggleFile: (file: IFileRef) => void;
  showListLoading: boolean;
  data: ResultDataPerObject;
};

function useAnalyze(): State {
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectAnalyzeData);

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

  const filteredData = useMemo(() => {
    const selectedKeys = selectedFiles.map((file) => file.name);
    return _.pickBy(data, (value, key) => selectedKeys.includes(key));
  }, [selectedFiles, data]);

  return {
    data: filteredData,
    files,
    selectedFiles,
    toggleFile: handleToggle,
    showListLoading: loading,
  };
}

export default useAnalyze;
