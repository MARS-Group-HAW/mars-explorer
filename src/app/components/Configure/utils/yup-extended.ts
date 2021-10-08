import * as Yup from "yup";
import { ValidationError } from "yup";
import { AnyObject, Maybe, Optionals } from "yup/lib/types";
import _ from "lodash";
import { AnySchema } from "yup/lib/schema";
import Lazy from "yup/lib/Lazy";
import { Asserts, TypeOf } from "yup/lib/util/types";

Yup.addMethod(
  Yup.array,
  "uniqueProperty",
  function (propertyPath: string, message: string) {
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
  }
);

declare module "yup" {
  interface ArraySchema<
    T extends AnySchema | Lazy<any, any>,
    C extends AnyObject = AnyObject,
    TIn extends Maybe<TypeOf<T>[]> = TypeOf<T>[] | undefined,
    TOut extends Maybe<Asserts<T>[]> = Asserts<T>[] | Optionals<TIn>
  > extends Yup.BaseSchema<TIn, C, TOut> {
    uniqueProperty(path: string, message: string): ArraySchema<T, C, TIn>;
  }
}

export default Yup;
