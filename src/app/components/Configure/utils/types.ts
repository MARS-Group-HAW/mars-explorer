import GlobalFieldNames from "../components/globals-form/utils/fieldNames";
import OutputFieldNames from "../components/outputs-form/utils/fieldNames";
import CsvFieldNames from "../components/output-csv-form/utils/fieldNames";

import TimeSpecification, {
  TimeUnit,
} from "../components/globals-form/utils/types";
import OutputSpecification from "../components/outputs-form/utils/types";
import FieldNames from "./fieldNames";
import { Delimiter } from "../components/output-csv-form/utils/types";

export type Config = {
  [FieldNames.GLOBALS]: Globals;
};

export type Globals = GlobalsOptions & Outputs;

export type GlobalsOptions = {
  [GlobalFieldNames.TIME_SPECIFICATION]: TimeSpecification;
  [GlobalFieldNames.DELTA_T]: number;
  [GlobalFieldNames.DELTA_T_UNIT]: TimeUnit;
  [GlobalFieldNames.STEPS]: number;
  [GlobalFieldNames.START_POINT]: string | null; // FIXME bug with yup
  [GlobalFieldNames.END_POINT]: string | null; // FIXME bug with yup
};

export type Outputs = {
  [OutputFieldNames.OUTPUT]: OutputSpecification;
};

export type NonOutput = {
  [OutputFieldNames.OUTPUT]: OutputSpecification.NONE;
  [OutputFieldNames.OPTIONS]: null;
};

export type CsvOutputs = {
  [OutputFieldNames.OUTPUT]: OutputSpecification.CSV;
  [OutputFieldNames.OPTIONS]: CsvOutputs;
};

export type CsvOutputOptions = {
  [CsvFieldNames.DELIMITER]: Delimiter;
  [CsvFieldNames.CULTURE]: string;
  [CsvFieldNames.ENCODING]: string;
  [CsvFieldNames.FILE_SUFFIX]: string;
  [CsvFieldNames.INCLUDE_HEADER]: boolean;
};
