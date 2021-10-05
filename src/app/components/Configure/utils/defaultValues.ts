import FieldNames from "./fieldNames";
import globalsDefaultValues from "../components/globals-form/utils/defaultValues";

import Config from "./types";

export default {
  [FieldNames.GLOBALS]: globalsDefaultValues,
  [FieldNames.AGENTS]: [],
  [FieldNames.LAYERS]: [],
  [FieldNames.ENTITIES]: [],
} as Config;
