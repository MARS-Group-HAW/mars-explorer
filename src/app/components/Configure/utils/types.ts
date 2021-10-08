import AgentsType from "../components/agents-form/utils/types";
import LayersType from "../components/layers-form/utils/types";

import FieldNames from "./fieldNames";
import GlobalsOptions from "../components/globals-form/utils/types";

class Config {
  [FieldNames.GLOBALS]: GlobalsOptions;

  [FieldNames.AGENTS]: AgentsType;

  [FieldNames.LAYERS]: LayersType;
}

export default Config;
