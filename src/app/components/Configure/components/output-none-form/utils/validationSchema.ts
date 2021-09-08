import * as Yup from "yup";
import { SchemaOf } from "yup";
import NoneOutput from "./types";
import defaultValues from "./defaultValues";

const ValidationSchema: SchemaOf<NoneOutput> = Yup.object()
  .nullable()
  .default(defaultValues);

export default ValidationSchema;
