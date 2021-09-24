export type ResultDatum = {
  Step: number;
  DateTime: string;
  Type: string;
  Xpos: number;
  Ypos: number;
  X: number;
  Y: number;
  ID: string;
  [key: string]: string | number;
};

export type ResultData = ResultDatum[];

export type ResultDataWithMeta = {
  file: string;
  data: ResultData;
  isLoading: boolean;
  hasCompleted: boolean;
};

export type ResultDataPerObject = {
  [key: string]: ResultDataWithMeta;
};

export default ResultData;
