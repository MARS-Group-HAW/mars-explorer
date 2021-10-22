import { TypeOf } from "yup";
import { TimeSpecification } from "@app/components/Configure/components/globals-form/utils/types";
import { OutputsValidationSchema } from "@app/components/Configure/components/outputs-form/utils/validationSchema";
import { OutputSpecification } from "@app/components/Configure/components/outputs-form/utils/types";
import validationSchema from "./validationSchema";
import { GlobalsValidationSchema } from "../components/globals-form/utils/validationSchema";
import { LayersMapping } from "../components/mappings-form/utils/types";

type SimFlags = {
  pythonVisualization: boolean;
  reportProgress: boolean;
  console?: boolean;
};

export type FormSchema = TypeOf<typeof validationSchema>;

class FormTransformer {
  public static configToForm(config: any): FormSchema {
    const parsedConfig = validationSchema.cast(config);

    const globals = parsedConfig.globals as GlobalsValidationSchema &
      OutputsValidationSchema;

    // remove old namings
    if (
      (config as any)?.globals?.startTime ||
      (config as any)?.globals?.endTime
    ) {
      globals.startPoint = config.globals?.startTime;
      delete (globals as any).startTime;
      globals.endPoint = config.globals?.endTime;
      delete (globals as any).endTime;
    }
    if (globals.startPoint && globals.endPoint) {
      delete globals.steps;
      globals.timeSpecification = TimeSpecification.DATETIME;
    } else {
      delete globals.deltaTUnit;
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
    delete globals.console;
    globals.pythonVisualization = true;
    globals.reportProgress = true;

    if (globals.timeSpecification) {
      if (globals.timeSpecification === TimeSpecification.STEP) {
        delete globals.startPoint;
        delete globals.endPoint;
        delete globals.deltaTUnit;
      }

      if (globals.timeSpecification === TimeSpecification.DATETIME) {
        delete globals.steps;
      }

      delete globals.timeSpecification;
    }

    schema.layers.forEach(
      (type: LayersMapping) => type.file === null && delete type.file
    );

    return schema;
  }
}

export default FormTransformer;
