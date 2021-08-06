import * as Yup from "yup";
import FieldNames from "./fieldNames";
import globalsValidationSchema from "./GlobalsForm/validationSchema";

export default Yup.object({
  [FieldNames.GLOBALS]: globalsValidationSchema,
});
