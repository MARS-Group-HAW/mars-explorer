import SimObjects from "./sim-objects";

export type ObjectCreationMessage = {
  projectPath: string;
  projectName: string;
  objectType: SimObjects;
  objectName: string;
};
