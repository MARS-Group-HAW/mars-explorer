import GlobalsFieldNames from "@app/components/Configure/components/globals-form/utils/fieldNames";
import OutputsFieldNames from "@app/components/Configure/components/outputs-form/utils/fieldNames";

import defaultValues from "@app/components/Configure/utils/defaultValues";

import TimeSpecification from "@app/components/Configure/components/globals-form/utils/types";
import OutputSpecification from "@app/components/Configure/components/outputs-form/utils/types";
import { ConfigValidationSchema } from "@app/components/Configure/utils/validationSchema";
import { Globals } from "@app/components/Configure/utils/types";
import transformer from "./transform";

// GIVEN, WHEN, THEN
describe("Transform", () => {
  describe("configToForm", () => {
    test("should return a truthy value", () => {
      expect(transformer.configToForm({})).toBeDefined();
    });

    test("should return the default config", () => {
      const input = {};
      expect(transformer.configToForm(input)).toStrictEqual(defaultValues);
    });

    test("should not mutate the input object", () => {
      const input = {};
      const clone = JSON.parse(JSON.stringify(input));
      transformer.configToForm(input);
      expect(input).toStrictEqual(clone);
    });

    test("should return a configuration without overwriting the provided value", () => {
      const steps = 5;

      const input = {
        globals: {
          steps,
        },
      };
      expect(transformer.configToForm(input).globals).toHaveProperty(
        "steps",
        steps
      );
    });

    test("should return a step-based configuration", () => {
      const input = {
        globals: {
          steps: 100,
        },
      };

      const output = transformer.configToForm(input);

      expect(output.globals).toHaveProperty(
        GlobalsFieldNames.TIME_SPECIFICATION,
        TimeSpecification.STEP
      );
    });

    test("should return a datepoint configuration", () => {
      const input = {
        globals: {
          startPoint: "2018-01-01T00:00:00",
          endPoint: "2018-04-01T23:00:00",
        },
      };

      const output = transformer.configToForm(input);

      expect(output.globals).toHaveProperty(
        GlobalsFieldNames.TIME_SPECIFICATION,
        TimeSpecification.DATETIME
      );
    });
    test("should return a default output configuration configuration", () => {
      const input = {};

      const { globals } = transformer.configToForm(input);
      expect(globals).toHaveProperty(
        OutputsFieldNames.OUTPUT,
        OutputSpecification.NONE
      );
      expect(globals).toHaveProperty(OutputsFieldNames.OPTIONS, null);
    });

    test("should parse config with agents to agent array", () => {
      const input = {
        agents: [
          {
            name: "Test",
            count: 50,
          },
        ],
      };

      const { agents } = transformer.configToForm(input);
      expect(agents).toEqual(input.agents);
    });
  });
  describe("formToConfig", () => {
    let form: ConfigValidationSchema;

    beforeEach(() => {
      form = {
        globals: {
          timeSpecification: TimeSpecification.STEP,
          deltaT: 1,
          deltaTUnit: "seconds",
          endPoint: null,
          startPoint: null,
          steps: 1,
          output: OutputSpecification.NONE,
          options: null,
        },
        agents: [],
      };
    });

    test("should return a truthy value", () => {
      expect(transformer.formToConfig(form)).toBeDefined();
    });

    test("should return no undefined or null", () => {
      const { globals } = transformer.formToConfig(form);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.START_POINT);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.END_POINT);
      expect(globals).not.toHaveProperty(OutputsFieldNames.OPTIONS);
    });

    test("should not mutate the input object", () => {
      const clone = JSON.parse(JSON.stringify(form));
      transformer.formToConfig(form);
      expect(form).toStrictEqual(clone);
    });

    test("should remove form-exclusive attributes", () => {
      const { globals } = transformer.formToConfig(form);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.TIME_SPECIFICATION);
    });

    test("should return a step-based configuration", () => {
      const { globals } = transformer.formToConfig(form);
      const { steps } = globals;
      expect(globals).toHaveProperty(GlobalsFieldNames.STEPS, steps);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.START_POINT);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.END_POINT);
    });

    test("should return a datepoint configuration", () => {
      const startPoint = "2018-01-01T00:00:00";
      const endPoint = "2018-04-01T23:00:00";

      const formGlobals = form.globals as Globals;
      formGlobals.startPoint = startPoint;
      formGlobals.endPoint = endPoint;
      formGlobals.timeSpecification = TimeSpecification.DATETIME;

      const { globals } = transformer.formToConfig(form);
      expect(globals).not.toHaveProperty(GlobalsFieldNames.STEPS);
      expect(globals).toHaveProperty(GlobalsFieldNames.START_POINT, startPoint);
      expect(globals).toHaveProperty(GlobalsFieldNames.END_POINT, endPoint);
    });
  });
});
