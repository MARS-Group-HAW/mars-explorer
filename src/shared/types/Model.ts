import { IFileRef } from "@shared/types/File";

export type ModelRef = IFileRef;

export type IModelFile = ModelRef & {
  content: string;
};

export type WorkingModel = IModelFile[];

export type Model = ModelRef & {
  files: {
    name: string;
    path: string;
    content: string;
  }[];
};
