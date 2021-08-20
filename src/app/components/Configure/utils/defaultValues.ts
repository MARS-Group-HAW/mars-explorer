import FieldNames from "./fieldNames";
import globalsDefaultValues from "../components/globals-form/utils/defaultValues";
import outputDefaultValues from "../components/outputs-form/utils/defaultValues";

import { Config } from "./types";

export default {
  [FieldNames.GLOBALS]: { ...globalsDefaultValues, ...outputDefaultValues },
} as Config;
