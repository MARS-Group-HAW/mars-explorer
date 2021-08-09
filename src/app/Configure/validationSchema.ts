import * as Yup from "yup";
import { SchemaOf } from "yup";
import FieldNames from "./fieldNames";
import globalsValidationSchema from "./GlobalsForm/validationSchema";
import { Config } from "./types";

const Schema: SchemaOf<Config> = Yup.object({
  [FieldNames.GLOBALS]: globalsValidationSchema,
});

export default Schema;
