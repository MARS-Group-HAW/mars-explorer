import * as Yup from "yup";
import { SchemaOf } from "yup";
import SqliteOutput from "./types";

// @ts-ignore
const ValidationSchema: SchemaOf<SqliteOutput> = Yup.object().shape({});

export default ValidationSchema;
