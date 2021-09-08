import FieldNames from "./fieldNames";
import OutputFieldNames from "../../outputs-form/utils/fieldNames";
import Outputs from "../../outputs-form/utils/types";

export enum TimeSpecification {
  STEP = "step",
  DATETIME = "date-time",
}

export const ALL_TIME_UNITS = [
  "milliseconds",
  "seconds",
  "minutes",
  "hours",
  "days",
  "months",
  "years",
];
type TimeUnitTuple = typeof ALL_TIME_UNITS; // readonly ['hearts', 'diamonds', 'spades', 'clubs']
export type TimeUnit = TimeUnitTuple[number];

export type GlobalsRunOptions = Omit<
  GlobalsOptions,
  OutputFieldNames.OUTPUT | OutputFieldNames.OPTIONS
>;

class GlobalsOptions extends Outputs {
  [FieldNames.TIME_SPECIFICATION]: TimeSpecification;

  [FieldNames.DELTA_T]: number;

  [FieldNames.DELTA_T_UNIT]: TimeUnit;

  [FieldNames.STEPS]: number;

  [FieldNames.START_POINT]: string | null; // FIXME bug with yup

  [FieldNames.END_POINT]: string | null; // FIXME bug with yup
}

export default GlobalsOptions;
