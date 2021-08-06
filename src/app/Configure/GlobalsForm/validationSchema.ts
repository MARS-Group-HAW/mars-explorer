import moment from "moment";
import * as Yup from "yup";
import FieldNames from "./fieldNames";

export default Yup.object().shape({
  [FieldNames.DELTA_T]: Yup.number()
    .required("Required")
    .integer()
    .min(0, "Must be greater than 0."),
  [FieldNames.DELTA_T_UNIT]: Yup.string().oneOf(["day", "minute", "hour"]), // FIXME
  [FieldNames.STEPS]: Yup.number()
    .integer()
    .min(0, "Must be greater than 0.")
    .when("startPoint", {
      is: (val: Date | null) => !val,
      then: Yup.number().required(
        "Steps is required if no start/end point provided"
      ),
    }),
  [FieldNames.START_POINT]: Yup.date()
    .test(
      "is-undefined-but-endPoint",
      // eslint-disable-next-line no-template-curly-in-string
      "${path} is required if endPoint is defined.",
      function (date): boolean {
        return this.parent.endPoint ? Boolean(date) : true;
      }
    )
    .test(
      "is-before-endPoint",
      // eslint-disable-next-line no-template-curly-in-string
      "${path} must be before endPoint.",
      function (date): boolean {
        if (!date || !this.parent.endPoint) return true;
        return moment(this.parent.endPoint).isAfter(date);
      }
    ),
  [FieldNames.END_POINT]: Yup.date().test(
    "is-undefined-but-startPoint",
    // eslint-disable-next-line no-template-curly-in-string
    "${path} is required if startPoint is defined.",
    function (date): boolean {
      return this.parent.startPoint ? Boolean(date) : true;
    }
  ),
});
