import * as Yup from "yup";
import { SchemaOf, TypeOf } from "yup";
import FieldNames from "./fieldNames";
import ObjectMappings from "./types";

export type MappingsValidationSchema = TypeOf<typeof ValidationSchema>;

const ValidationSchema: SchemaOf<ObjectMappings> = Yup.array().of(
  Yup.object().shape({
    [FieldNames.NAME]: Yup.string().required(),
    [FieldNames.COUNT]: Yup.number().integer().min(0),
    [FieldNames.FILE]: Yup.string(),
    [FieldNames.MAPPING]: Yup.array().of(
      Yup.object().shape({
        [FieldNames.PARAMETER]: Yup.string().required(),
        [FieldNames.VALUE]: Yup.mixed().required(),
      })
    ),
  })
);

export default ValidationSchema;
