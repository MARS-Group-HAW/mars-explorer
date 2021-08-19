import * as Yup from "yup";
import { SchemaOf } from "yup";
import { Outputs } from "../../../utils/types";
import FieldNames from "./fieldNames";
import OutputSpecification from "./types";
import CsvValidationSchema from "../../output-csv-form/utils/validationSchema";

// @ts-ignore
const ValidationSchema: SchemaOf<Outputs> = Yup.object().shape({
  [FieldNames.OUTPUT]: Yup.mixed().oneOf(Object.values(OutputSpecification)),
  [FieldNames.OPTIONS]: Yup.object()
    .when([FieldNames.OUTPUT], {
      is: OutputSpecification.NONE,
      then: Yup.object().shape({}),
    })
    .when([FieldNames.OUTPUT], {
      is: OutputSpecification.CSV,
      then: CsvValidationSchema,
    }),
});

export default ValidationSchema;
