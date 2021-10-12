import { SimulationStates } from "@shared/types/SimulationStates";
import { WorldSizes } from "@shared/types/ObjectData";
import { ResultData } from "../../Analyze/utils/ResultData";

// Define a type for the slice state
export type SimulationState = {
  simulationState: SimulationStates;
  maxProgress?: number;
  worldSizes?: WorldSizes;
  resultData: ResultData;
};

export type SavedSimulationResults = {
  projectPath: string;
  results: SimulationState;
};
