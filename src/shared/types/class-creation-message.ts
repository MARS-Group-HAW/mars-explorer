import SimObjects from "./sim-objects";

type DependentLayerArgs = {
  dependentLayerName: string;
};

export type ClassCreationMessage = {
  projectPath: string;
  projectName: string;
  className: string;
  type: SimObjects;
  args?: DependentLayerArgs;
};
