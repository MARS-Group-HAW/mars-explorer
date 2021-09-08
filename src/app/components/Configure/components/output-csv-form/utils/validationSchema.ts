import * as Yup from "yup";
import { SchemaOf } from "yup";
import CsvOutputOptions, { ALL_DELIMITERS } from "./types";
import FieldNames from "./fieldNames";
import defaultValues from "./defaultValues";

const ValidationSchema: SchemaOf<CsvOutputOptions> = Yup.object().shape({
  [FieldNames.DELIMITER]: Yup.string()
    .oneOf(ALL_DELIMITERS)
    .default(defaultValues[FieldNames.DELIMITER]),
  [FieldNames.FILE_SUFFIX]: Yup.string().default(
    defaultValues[FieldNames.FILE_SUFFIX]
  ),
  [FieldNames.ENCODING]: Yup.string().default(
    defaultValues[FieldNames.ENCODING]
  ),
  [FieldNames.INCLUDE_HEADER]: Yup.boolean().default(
    defaultValues[FieldNames.INCLUDE_HEADER]
  ),
  [FieldNames.CULTURE]: Yup.string()
    .matches(/[a-z]{2}-[A-Z]{2}/, {
      excludeEmptyString: true,
      message: "Enter a valid LCID string (e.g. en-EN or de-DE).",
    })
    .default(defaultValues[FieldNames.CULTURE]),
});

export default ValidationSchema;
