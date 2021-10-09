import SimObjects from "./sim-objects";

type GenericClassCreationMessage = {
  projectPath: string;
  projectName: string;
  className: string;
  type: SimObjects;
};

export type AgentClassCreationMessage = GenericClassCreationMessage & {
  type: SimObjects.AGENT;
  layerClassName: string;
};

export type DependentLayerClassCreationMessage = GenericClassCreationMessage & {
  type: SimObjects.DEPENDENT_LAYER;
  dependentLayerName: string;
};

export type ClassCreationMessage =
  | GenericClassCreationMessage
  | AgentClassCreationMessage
  | DependentLayerClassCreationMessage;
