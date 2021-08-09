import FieldNames from "./GlobalsForm/fieldNames";
import { TimeUnit } from "./FormComponents/types";

export type Config = {
  globals: Globals;
};

export type Globals = {
  [FieldNames.DELTA_T]: number;
  [FieldNames.DELTA_T_UNIT]: TimeUnit;
  [FieldNames.STEPS]: number;
  [FieldNames.START_POINT]: string | null; // FIXME bug with yup
  [FieldNames.END_POINT]: string | null; // FIXME bug with yup
};
