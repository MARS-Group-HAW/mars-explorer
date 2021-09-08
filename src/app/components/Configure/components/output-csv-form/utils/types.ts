import CsvFieldNames from "./fieldNames";

export const ALL_DELIMITERS = [",", ";", "\\t", "\\s"];

export type Delimiter = typeof ALL_DELIMITERS[number];

type CsvOutputOptions = {
  [CsvFieldNames.DELIMITER]: Delimiter;
  [CsvFieldNames.CULTURE]: string;
  [CsvFieldNames.ENCODING]: string;
  [CsvFieldNames.FILE_SUFFIX]: string;
  [CsvFieldNames.INCLUDE_HEADER]: boolean;
};

export default CsvOutputOptions;
