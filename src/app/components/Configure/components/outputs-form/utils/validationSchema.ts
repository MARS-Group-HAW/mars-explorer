import * as Yup from "yup";
import { SchemaOf } from "yup";
import { Outputs } from "../../../utils/types";
import FieldNames from "./fieldNames";
import OutputSpecification from "./types";

const ValidationSchema: SchemaOf<Outputs> = Yup.object().shape({
  [FieldNames.OUTPUT_SPECIFICATION]: Yup.mixed().oneOf(
    Object.values(OutputSpecification)
  ),
});

export default ValidationSchema;
