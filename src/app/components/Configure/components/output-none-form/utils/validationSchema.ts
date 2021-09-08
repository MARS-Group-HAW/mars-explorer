import * as Yup from "yup";
import { SchemaOf } from "yup";
import NoneOutput from "./types";

const ValidationSchema: SchemaOf<NoneOutput> = Yup.object().nullable();

export default ValidationSchema;
