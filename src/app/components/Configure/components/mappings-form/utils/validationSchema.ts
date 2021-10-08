import * as Yup from "yup";
import { SchemaOf, TypeOf, ValidationError } from "yup";
import _ from "lodash";
import FieldNames from "./fieldNames";
import ObjectMappings from "./types";

export type MappingsValidationSchema = TypeOf<typeof ValidationSchema>;

Yup.addMethod(Yup.array, "uniqueProperty", function (propertyPath, message) {
  return this.test("unique", "", function (list = []) {
    const errors: ValidationError[] = [];

    list.forEach((item, index) => {
      const propertyValue = _.get(item, propertyPath);

      if (
        propertyValue &&
        _.filter(list, [propertyPath, propertyValue]).length > 1
      ) {
        errors.push(
          this.createError({
            path: `${this.path}[${index}].${propertyPath}`,
            message,
          })
        );
      }
    });

    if (!_.isEmpty(errors)) {
      throw new Yup.ValidationError(errors);
    }

    return true;
  });
});

const ValidationSchema: SchemaOf<ObjectMappings> = Yup.array().of(
  Yup.object().shape({
    [FieldNames.NAME]: Yup.string().required(),
    [FieldNames.COUNT]: Yup.number().integer().min(0),
    [FieldNames.FILE]: Yup.string().nullable(),
    [FieldNames.MAPPING]: Yup.array()
      .of(
        Yup.object().shape({
          [FieldNames.PARAMETER]: Yup.string().required(),
          [FieldNames.VALUE]: Yup.mixed().required(),
        })
      )
      // @ts-ignore
      .uniqueProperty([FieldNames.PARAMETER], "Duplicate parameter name"),
  })
);

export default ValidationSchema;
