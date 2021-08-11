import * as Yup from "yup";
import { SchemaOf } from "yup";
import FieldNames from "./fieldNames";
import { Globals } from "../../../utils/types";
import TimeSpecification, { ALL_TIME_UNITS } from "./types";

const ValidationSchema: SchemaOf<Globals> = Yup.object().shape({
  [FieldNames.DELTA_T]: Yup.number()
    .required("Required")
    .integer()
    .min(0, "Must be greater than 0."),
  [FieldNames.DELTA_T_UNIT]: Yup.string().oneOf(ALL_TIME_UNITS),
  [FieldNames.TIME_SPECIFICATION]: Yup.mixed().oneOf(
    Object.values(TimeSpecification)
  ),
  [FieldNames.STEPS]: Yup.number()
    .integer()
    .min(0, "Must be greater than 0.")
    .when(FieldNames.TIME_SPECIFICATION, {
      is: TimeSpecification.STEP,
      then: Yup.number().required(
        "Steps is required if no start/end point provided"
      ),
    }),
  [FieldNames.START_POINT]: Yup.mixed().when(FieldNames.TIME_SPECIFICATION, {
    is: TimeSpecification.DATETIME,
    then: Yup.date()
      .required("A date is required if steps is not provided")
      .when(FieldNames.END_POINT, {
        is: (val: Date | null) => val,
        then: Yup.date().required(
          "Start Point is required if End Point is defined"
        ),
      }),
    otherwise: Yup.mixed().nullable(),
  }),
  [FieldNames.END_POINT]: Yup.mixed().when(FieldNames.TIME_SPECIFICATION, {
    is: TimeSpecification.DATETIME,
    then: Yup.date()
      .required("A date is required if steps is not provided")
      .min(
        Yup.ref(FieldNames.START_POINT),
        "End Point must be after Start Point"
      ),
    otherwise: Yup.mixed().nullable(),
  }),
});

export default ValidationSchema;
