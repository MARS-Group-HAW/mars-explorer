import * as Yup from "yup";
import { SchemaOf, TypeOf } from "yup";
import FieldNames from "./fieldNames";
import globalsValidationSchema from "../components/globals-form/utils/validationSchema";
import agentsValidationSchema from "../components/agents-form/utils/validationSchema";

import Config from "./types";

export type ConfigValidationSchema = TypeOf<typeof Schema>;

const Schema: SchemaOf<Config> = Yup.object({
  [FieldNames.GLOBALS]: globalsValidationSchema,
  [FieldNames.AGENTS]: agentsValidationSchema,
});

export default Schema;
