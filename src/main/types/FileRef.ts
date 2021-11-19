import nodePath from "path";
import { IFileRef } from "@shared/types/File";

class FileRef implements IFileRef {
  public readonly name: string;

  constructor(public readonly path: string) {
    this.name = path.split(nodePath.sep).pop();
  }
}

export default FileRef;
