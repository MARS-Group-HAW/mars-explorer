export type ObjectCount = number;

export type InputObjectCounts = {
  [key: string]: ObjectCount;
};

export type InputObjectCoordinates = {
  [key: string]: ObjectCoordinate;
};

export type ObjectCoordinate = {
  x: number;
  y: number;
  count: number;
}[];

export type ObjectResultsMap = {
  [key: string]: {
    count: ObjectCount;
    coords: ObjectCoordinate;
  };
};
