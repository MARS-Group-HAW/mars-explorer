import { IModelFile } from "@shared/types/Model";

export type ModelWithMetadata = {
  model: IModelFile;
  isDirty: boolean;
  isErroneous: boolean;
  lastSavedVersion: number;
};
