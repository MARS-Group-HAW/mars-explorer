import SimObjects from "./sim-objects";

export type ClassCreationMessage = {
  projectPath: string;
  projectName: string;
  type: SimObjects;
  className: string;
};
