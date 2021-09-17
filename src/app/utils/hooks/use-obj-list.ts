import { useState } from "react";
import { IFileRef } from "@shared/types/File";

export type UseCsvListState = {
  selectedFile?: IFileRef;
  selectFileByName: (file: string) => void;
  files: IFileRef[];
  setFiles: (files: IFileRef[]) => void;
};

function useObjList(): UseCsvListState {
  const [files, setFiles] = useState<IFileRef[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFileRef>();

  function handleFileSelection(selectedFileName: string) {
    const foundFile = files.find((file) => file.name === selectedFileName);

    if (!foundFile) {
      window.api.logger.warn(
        `Selected file ${selectedFileName} does not exist. This should not happen.`
      );
      return;
    }

    setSelectedFile(foundFile);
  }

  return {
    files,
    setFiles,
    selectedFile,
    selectFileByName: handleFileSelection,
  };
}

export default useObjList;
