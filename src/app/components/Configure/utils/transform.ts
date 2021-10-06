import { TypeOf } from "yup";
import { TimeSpecification } from "@app/components/Configure/components/globals-form/utils/types";
import { OutputsValidationSchema } from "@app/components/Configure/components/outputs-form/utils/validationSchema";
import { OutputSpecification } from "@app/components/Configure/components/outputs-form/utils/types";
import validationSchema from "./validationSchema";
import { GlobalsValidationSchema } from "../components/globals-form/utils/validationSchema";

type SimFlags = {
  pythonVisualization: boolean;
  console: boolean;
};

export type FormSchema = TypeOf<typeof validationSchema>;

class FormTransformer {
  public static configToForm(config: unknown): FormSchema {
    const parsedConfig = validationSchema.cast(config);

    const globals = parsedConfig.globals as GlobalsValidationSchema &
      OutputsValidationSchema;

    if (globals.startPoint && globals.endPoint) {
      delete globals.steps;
      globals.timeSpecification = TimeSpecification.DATETIME;
    } else {
      globals.timeSpecification = TimeSpecification.STEP;
    }

    if (!globals.output) {
      globals.output = OutputSpecification.NONE;
    }

    return parsedConfig;
  }

  public static formToConfig(schema: FormSchema): any {
    const globals = schema.globals as GlobalsValidationSchema &
      OutputsValidationSchema &
      SimFlags;

    // FIXME: output options currently not in use
    globals.output = OutputSpecification.CSV;
    delete globals.options;
    globals.pythonVisualization = true;
    globals.console = true;

    if (globals.timeSpecification) {
      if (globals.timeSpecification === TimeSpecification.STEP) {
        delete globals.startPoint;
        delete globals.endPoint;
      }

      if (globals.timeSpecification === TimeSpecification.DATETIME) {
        delete globals.steps;
      }

      delete globals.timeSpecification;
    }

    return schema;
  }
}

export default FormTransformer;
