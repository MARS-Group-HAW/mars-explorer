import FieldNames from "./fieldNames";
import { Globals } from "../../../utils/types";

export default {
  [FieldNames.TIME_SPECIFICATION]: "step",
  [FieldNames.DELTA_T]: 1,
  [FieldNames.DELTA_T_UNIT]: "seconds",
  [FieldNames.END_POINT]: null,
  [FieldNames.START_POINT]: null,
  [FieldNames.STEPS]: 1,
} as Globals;
