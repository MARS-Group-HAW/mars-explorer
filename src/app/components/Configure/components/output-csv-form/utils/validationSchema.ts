import * as Yup from "yup";
import { SchemaOf } from "yup";
import { CsvOutputs } from "../../../utils/types";
import FieldNames from "./fieldNames";
import { ALL_DELIMITERS } from "./types";

const ValidationSchema: SchemaOf<CsvOutputs> = Yup.object().shape({
  [FieldNames.DELIMITER]: Yup.string().oneOf(ALL_DELIMITERS),
  [FieldNames.FILE_SUFFIX]: Yup.string(),
  [FieldNames.ENCODING]: Yup.string(),
  [FieldNames.INCLUDE_HEADER]: Yup.boolean(),
  [FieldNames.CULTURE]: Yup.string().matches(/[a-z]{2}-[A-Z]{2}/, {
    excludeEmptyString: true,
    message: "Enter a valid LCID string (e.g. en-EN or de-DE).",
  }),
});

export default ValidationSchema;
