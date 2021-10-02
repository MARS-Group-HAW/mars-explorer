export type ObjectCount = {
  name: string;
  count: number;
};

export type TypedMetaData = ObjectCount[];

export type InputObjectCoordinates = {
  [key: string]: ObjectCoordinate;
};

export type ObjectCoordinate = {
  x: number;
  y: number;
  count: number;
}[];

export type ObjectProgressResult = {
  name: string;
  count: number;
  coords: ObjectCoordinate;
};

export type ObjectProgressResults = ObjectProgressResult[];
