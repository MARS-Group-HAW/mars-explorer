import * as Yup from "yup";
import { SchemaOf, TypeOf } from "yup";

export type GlobalsValidationSchema = TypeOf<typeof ValidationSchema>;

const ValidationSchema: SchemaOf<any> = Yup.object().shape({});

export default ValidationSchema;
