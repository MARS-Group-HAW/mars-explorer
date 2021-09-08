import * as Yup from "yup";
import { SchemaOf, TypeOf } from "yup";
import Outputs, { OutputSpecification } from "./types";
import FieldNames from "./fieldNames";
import CsvValidationSchema from "../../output-csv-form/utils/validationSchema";
import SqliteValidationSchema from "../../output-sqlite-form/utils/validationSchema";
import NoneValidationSchema from "../../output-none-form/utils/validationSchema";
import defaultValues from "./defaultValues";

export type OutputsValidationSchema = TypeOf<typeof ValidationSchema>;

const ValidationSchema: SchemaOf<Outputs> = Yup.object().shape({
  [FieldNames.OUTPUT]: Yup.mixed()
    .oneOf(Object.values(OutputSpecification))
    .default(defaultValues[FieldNames.OUTPUT]),
  [FieldNames.OPTIONS]: Yup.object()
    .when([FieldNames.OUTPUT], {
      is: OutputSpecification.NONE,
      then: NoneValidationSchema,
    })
    .when([FieldNames.OUTPUT], {
      is: OutputSpecification.CSV,
      then: CsvValidationSchema,
    })
    .when([FieldNames.OUTPUT], {
      is: OutputSpecification.SQLITE,
      then: SqliteValidationSchema,
    })
    .default(defaultValues[FieldNames.OPTIONS]),
});

export default ValidationSchema;
