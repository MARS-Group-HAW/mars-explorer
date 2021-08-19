import * as Yup from "yup";
import { SchemaOf } from "yup";
import { Outputs } from "../../../utils/types";

// @ts-ignore
const ValidationSchema: SchemaOf<Outputs> = Yup.object().shape({});

export default ValidationSchema;
