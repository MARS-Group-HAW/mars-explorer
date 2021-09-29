export type ObjectCount = number;

export type ObjectCounts = {
  [key: string]: ObjectCount;
};

export type ObjectCoordinate = [number, number][];

export type ObjectCoordinates = {
  [key: string]: ObjectCoordinate;
};

export type ObjectResultsMap = {
  [key: string]: {
    count: ObjectCount;
    coords: ObjectCoordinate;
  };
};
