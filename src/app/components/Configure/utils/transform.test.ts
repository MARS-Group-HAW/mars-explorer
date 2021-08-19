import transformer from "./transform";

describe("Transform", () => {
  describe("configToForm", () => {
    test("Output to be defined.", () => {
      expect(transformer.configToForm({})).toBeDefined();
    });

    test("Output to be defined.", () => {
      const input = {
        globals: {
          steps: 100,
          output: "csv",
          options: {
            delimiter: ";",
            format: "en-EN",
          },
        },
      };

      expect(transformer.configToForm(input)).toStrictEqual(input);
    });
  });
});
