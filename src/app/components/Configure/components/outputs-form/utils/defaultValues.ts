import FieldNames from "./fieldNames";
import defaultValues from "../../output-none-form/utils/defaultValues";
import Outputs, { OutputSpecification } from "./types";

export default {
  [FieldNames.OUTPUT]: OutputSpecification.NONE,
  [FieldNames.OPTIONS]: defaultValues,
} as Outputs;
