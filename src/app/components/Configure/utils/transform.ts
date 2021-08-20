import { TypeOf } from "yup";
import TimeSpecification from "@app/components/Configure/components/globals-form/utils/types";
import { OutputsValidationSchema } from "@app/components/Configure/components/outputs-form/utils/validationSchema";
import OutputSpecification from "@app/components/Configure/components/outputs-form/utils/types";
import validationSchema from "./validationSchema";
import defaultValues from "./defaultValues";
import { GlobalsValidationSchema } from "../components/globals-form/utils/validationSchema";

type FormSchema = TypeOf<typeof validationSchema>;

class FormTransformer {
  public static configToForm(config: unknown): FormSchema {
    let formSchema = validationSchema.cast(config);
    formSchema = FormTransformer.removeEmptyObj(
      FormTransformer.removeUndefined(formSchema)
    );

    const parsedConfig = {
      ...defaultValues,
      ...formSchema,
    } as FormSchema;

    const globals = parsedConfig.globals as GlobalsValidationSchema &
      OutputsValidationSchema;

    if (globals.startPoint && globals.endPoint) {
      delete globals.steps;
      globals.timeSpecification = TimeSpecification.DATETIME;
    } else {
      globals.timeSpecification = TimeSpecification.STEP;
    }

    return parsedConfig;
  }

  private static removeUndefined(obj: any) {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === Object(obj[key]))
        newObj[key] = FormTransformer.removeUndefined(obj[key]);
      else if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
  }

  private static removeEmptyObj(obj: any) {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const potentialObj = obj[key];

      if (
        potentialObj === Object(potentialObj) &&
        Object.keys(potentialObj).length > 0
      )
        newObj[key] = FormTransformer.removeUndefined(potentialObj);
      else if (
        potentialObj !== undefined &&
        Object.keys(potentialObj).length > 0
      )
        newObj[key] = potentialObj;
    });
    return newObj;
  }

  /*
  public static formToConfig({ globals, outputs }: FormSchema): any {
    const { deltaT, deltaTUnit, steps, startPoint, endPoint } = globals;
    const { output, options } = outputs;

    return {
      globals: {
        deltaT,
        deltaTUnit,
        steps,
        startPoint,
        endPoint,
        output,
        options,
      },
    };
  }
   */
}

export default FormTransformer;
