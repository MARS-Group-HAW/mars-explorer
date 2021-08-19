import { TypeOf } from "yup";
import validationSchema from "./validationSchema";

import GlobalsFieldNames from "../components/globals-form/utils/fieldNames";
import GlobalsDefaultValues from "../components/globals-form/utils/defaultValues";
import { GlobalsValidationSchema } from "../components/globals-form/utils/validationSchema";

type FormSchema = TypeOf<typeof validationSchema>;

class FormTransformer {
  public static configToForm(config: unknown): FormSchema {
    const formSchema = validationSchema.cast(config);
    (formSchema.globals as GlobalsValidationSchema)[
      GlobalsFieldNames.TIME_SPECIFICATION
    ] = GlobalsDefaultValues[GlobalsFieldNames.TIME_SPECIFICATION];
    return formSchema;
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
