export type ModelRef = {
  name: string;
  path: string;
};

export type Model = ModelRef & {
  mainFile: string;
  files: string[];
};
