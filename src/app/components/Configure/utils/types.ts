import GlobalFieldNames from "../components/globals-form/utils/fieldNames";
import OutputFieldNames from "../components/outputs-form/utils/fieldNames";
import CsvFieldNames from "../components/output-csv-form/utils/fieldNames";

import TimeSpecification, {
  TimeUnit,
} from "../components/globals-form/utils/types";
import OutputSpecification from "../components/outputs-form/utils/types";
import FieldNames from "./fieldNames";
import { Delimiter } from "../components/output-csv-form/utils/types";
import { Empty } from "../../../util/types/utils";

export type Config = {
  [FieldNames.GLOBALS]: Globals;
  [FieldNames.OUTPUTS]: Outputs;
};

export type Globals = {
  [GlobalFieldNames.TIME_SPECIFICATION]: TimeSpecification;
  [GlobalFieldNames.DELTA_T]: number;
  [GlobalFieldNames.DELTA_T_UNIT]: TimeUnit;
  [GlobalFieldNames.STEPS]: number;
  [GlobalFieldNames.START_POINT]: string | null; // FIXME bug with yup
  [GlobalFieldNames.END_POINT]: string | null; // FIXME bug with yup
};

export type Outputs = {
  [OutputFieldNames.OUTPUT]: OutputSpecification;
  [OutputFieldNames.OPTIONS]: CsvOutputs | Empty;
};

export type CsvOutputs = {
  [CsvFieldNames.DELIMITER]: Delimiter;
  [CsvFieldNames.CULTURE]: string;
  [CsvFieldNames.ENCODING]: string;
  [CsvFieldNames.FILE_SUFFIX]: string;
  [CsvFieldNames.INCLUDE_HEADER]: boolean;
};
