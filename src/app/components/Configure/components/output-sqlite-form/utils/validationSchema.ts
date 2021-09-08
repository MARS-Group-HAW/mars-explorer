import * as Yup from "yup";
import { SchemaOf } from "yup";
import SqliteOutput from "./types";
import defaultValues from "./defaultValues";

const ValidationSchema: SchemaOf<SqliteOutput> = Yup.object()
  .shape({})
  .default(defaultValues);

export default ValidationSchema;
