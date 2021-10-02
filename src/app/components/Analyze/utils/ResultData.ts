import { ObjectProgressResult } from "@shared/types/ObjectData";

export type ResultDatum = Omit<ObjectProgressResult, "name">;

export type ResultDataPerTick = ResultDatum[];

export type ResultDataWithMeta = {
  name: string;
  data: ResultDataPerTick;
  isLoading: boolean;
  hasCompleted: boolean;
  hasBeenRestored: boolean;
};

export type ResultData = ResultDataWithMeta[];

export default ResultDataPerTick;
