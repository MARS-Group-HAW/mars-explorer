import { IModelFile } from "./Model";

type ExampleProject = {
  name: string;
  path: string;
  readme?: IModelFile;
  models: IModelFile[];
};

export default ExampleProject;
