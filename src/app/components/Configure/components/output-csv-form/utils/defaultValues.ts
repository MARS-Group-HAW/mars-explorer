import FieldNames from "./fieldNames";
import { CsvOutputs } from "../../../utils/types";

export default {
  [FieldNames.DELIMITER]: ",",
  [FieldNames.ENCODING]: "UTF-8",
  [FieldNames.INCLUDE_HEADER]: true,
  [FieldNames.CULTURE]: "en-EN",
  [FieldNames.FILE_SUFFIX]: "",
} as CsvOutputs;
