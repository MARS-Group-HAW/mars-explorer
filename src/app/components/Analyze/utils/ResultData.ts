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

type ResultData = ResultDatum[];

export type ResultDataPerObject = {
  [key: string]: {
    file: string;
    data: ResultData;
    isLoading: boolean;
  };
};

export default ResultData;
