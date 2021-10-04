export type ObjectCount = {
  name: string;
  count: number;
};

export type ObjectCounts = ObjectCount[];

export type ObjectCoordinate = {
  x: number;
  y: number;
  count: number;
};

export type ObjectCoordinates = {
  name: string;
  coords: ObjectCoordinate[];
};
