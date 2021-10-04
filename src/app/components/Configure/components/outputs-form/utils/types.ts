import OutputFieldNames from "./fieldNames";
import NoneOutputOptions from "../../output-none-form/utils/types";
import CsvOutputOptions from "../../output-csv-form/utils/types";
import SqliteOutput from "../../output-sqlite-form/utils/types";

export enum OutputSpecification {
  NONE = "none",
  CSV = "csv",
  SQLITE = "sqlite",
}

class Outputs {
  [OutputFieldNames.OUTPUT]: OutputSpecification;

  [OutputFieldNames.OPTIONS]:
    | NoneOutputOptions
    | CsvOutputOptions
    | SqliteOutput;
}

export default Outputs;
