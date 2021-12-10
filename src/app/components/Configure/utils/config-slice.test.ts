import {
  configSlice,
  initialState,
  selectConfigHasBeenChecked,
} from "./config-slice";
import ValidationState from "../../../utils/types/validation-state";

const { reducer, actions } = configSlice;

const init = initialState;

describe("config-slice", () => {
  describe("actions", () => {
    test("should add errors", () => {
      const exampleErrors = ["Some error"];
      expect(
        reducer(initialState, actions.setErrors(exampleErrors)).errors
      ).toEqual(exampleErrors);
    });
  });
  describe("selectors", () => {
    test("should return that config is not checked", () => {
      expect(
        selectConfigHasBeenChecked({
          config: init,
        } as any)
      ).toBe(false);
    });

    test("should return that config is checked", () => {
      const checkedStates = [
        ValidationState.VALID,
        ValidationState.INVALID,
        ValidationState.DIRTY,
      ];

      checkedStates.forEach((state) =>
        expect(
          selectConfigHasBeenChecked({
            config: {
              status: state,
            },
          } as any)
        ).toBe(true)
      );
    });
  });
});
