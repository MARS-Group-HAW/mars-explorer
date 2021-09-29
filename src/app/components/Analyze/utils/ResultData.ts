import { ObjectCoordinate, ObjectCount } from "@shared/types/ObjectData";

export type ResultDatum = {
  count: ObjectCount;
  coords: ObjectCoordinate;
};

export type ResultDataPerTick = ResultDatum[];

export type ResultDataWithMeta = {
  data: ResultDataPerTick;
  isLoading: boolean;
  hasCompleted: boolean;
  hasBeenRestored: boolean;
};

export type ResultDataMap = {
  [key: string]: ResultDataWithMeta;
};

export default ResultDataPerTick;
