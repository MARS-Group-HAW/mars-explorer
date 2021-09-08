import FieldNames from "./fieldNames";
import GlobalsOptions, { GlobalsRunOptions } from "./types";
import OutputDefaultValues from "../../outputs-form/utils/defaultValues";

const GlobalsRunDefaultValues = {
  [FieldNames.TIME_SPECIFICATION]: "step",
  [FieldNames.DELTA_T]: 1,
  [FieldNames.DELTA_T_UNIT]: "seconds",
  [FieldNames.END_POINT]: null,
  [FieldNames.START_POINT]: null,
  [FieldNames.STEPS]: 1,
} as GlobalsRunOptions;

export default {
  ...GlobalsRunDefaultValues,
  ...OutputDefaultValues,
} as GlobalsOptions;
