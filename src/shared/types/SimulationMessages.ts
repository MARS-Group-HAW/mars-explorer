import { ObjectCoordinates, ObjectCounts, WorldSizes } from "./ObjectData";

type SimulationMessage = {
  progress: number;
};

export type SimulationCountMessage = SimulationMessage & {
  objectCounts: ObjectCounts;
};

export type SimulationVisMessage = SimulationMessage & {
  objectCoords: ObjectCoordinates;
};

export type SimulationWorldSizeMessage = {
  worldSizes: WorldSizes;
};
