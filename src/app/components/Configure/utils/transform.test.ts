import GlobalsFieldNames from "@app/components/Configure/components/globals-form/utils/fieldNames";
import OutputsFieldNames from "@app/components/Configure/components/outputs-form/utils/fieldNames";

import defaultValues from "@app/components/Configure/utils/defaultValues";

import TimeSpecification from "@app/components/Configure/components/globals-form/utils/types";
import OutputSpecification from "@app/components/Configure/components/outputs-form/utils/types";
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
  });
});
