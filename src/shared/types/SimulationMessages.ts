import { ObjectProgressResults } from "./ObjectData";

export type SimulationProgressMessage = {
  progress: number;
  results: ObjectProgressResults;
};
