import { IModelFile } from "@shared/types/Model";
import { readFileSync } from "fs";
import FileRef from "./FileRef";

class ModelFile extends FileRef implements IModelFile {
  public content: string;

  constructor(path: string) {
    super(path);
    this.content = readFileSync(path, "utf-8");
  }
}

export default ModelFile;
