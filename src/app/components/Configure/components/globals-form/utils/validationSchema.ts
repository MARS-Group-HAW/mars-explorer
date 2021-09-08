import * as Yup from "yup";
import { SchemaOf, TypeOf } from "yup";
import FieldNames from "./fieldNames";
import GlobalsOptions, { ALL_TIME_UNITS, TimeSpecification } from "./types";
import OutputsValidationSchema from "../../outputs-form/utils/validationSchema";
import defaultValues from "./defaultValues";

export type GlobalsValidationSchema = TypeOf<typeof ValidationSchema>;

const ValidationSchema: SchemaOf<GlobalsOptions> = Yup.object()
  .shape({
    [FieldNames.DELTA_T]: Yup.number()
      .required("Required")
      .integer()
      .min(0, "Must be greater than 0.")
      .default(defaultValues[FieldNames.DELTA_T]),
    [FieldNames.DELTA_T_UNIT]: Yup.string()
      .oneOf(ALL_TIME_UNITS)
      .default(defaultValues[FieldNames.DELTA_T_UNIT]),
    [FieldNames.TIME_SPECIFICATION]: Yup.mixed()
      .oneOf(Object.values(TimeSpecification))
      .default(defaultValues[FieldNames.TIME_SPECIFICATION]),
    [FieldNames.STEPS]: Yup.number()
      .integer()
      .min(0, "Must be greater than 0.")
      .when(FieldNames.TIME_SPECIFICATION, {
        is: TimeSpecification.STEP,
        then: Yup.number().required(
          "Steps is required if no start/end point provided"
        ),
      })
      .default(defaultValues[FieldNames.STEPS]),
    [FieldNames.START_POINT]: Yup.mixed()
      .when(FieldNames.TIME_SPECIFICATION, {
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
      })
      .default(defaultValues[FieldNames.START_POINT]),
    [FieldNames.END_POINT]: Yup.mixed()
      .when(FieldNames.TIME_SPECIFICATION, {
        is: TimeSpecification.DATETIME,
        then: Yup.date()
          .required("A date is required if steps is not provided")
          .min(
            Yup.ref(FieldNames.START_POINT),
            "End Point must be after Start Point"
          ),
        otherwise: Yup.mixed().nullable(),
      })
      .default(defaultValues[FieldNames.END_POINT]),
  })
  .concat(OutputsValidationSchema);

export default ValidationSchema;
