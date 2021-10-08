import { SchemaOf } from "yup";
import Yup from "../../../utils/yup-extended";
import FieldNames from "./fieldNames";
import { IndividualMapping } from "./types";

const ValidationSchema: SchemaOf<IndividualMapping[]> = Yup.array()
  .of(
    Yup.object().shape({
      [FieldNames.PARAMETER]: Yup.string().required(),
      [FieldNames.VALUE]: Yup.mixed().required(),
    })
  )
  .uniqueProperty(FieldNames.PARAMETER, "Duplicate parameter name");

export default ValidationSchema;
