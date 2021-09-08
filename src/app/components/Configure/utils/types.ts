import { Type } from "class-transformer";
import AgentsType from "../components/agents-form/utils/types";
import FieldNames from "./fieldNames";
import GlobalsOptions from "../components/globals-form/utils/types";

class Config {
  @Type(() => GlobalsOptions)
  [FieldNames.GLOBALS]: GlobalsOptions;

  [FieldNames.AGENTS]: AgentsType;
}

export default Config;
