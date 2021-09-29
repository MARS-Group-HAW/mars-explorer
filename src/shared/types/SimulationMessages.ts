import { ObjectResultsMap } from "./ObjectData";

export type SimulationProgressMessage = {
  progress: number;
  results: ObjectResultsMap;
};
