import { IModelFile } from "@shared/types/Model";
import {
  modelSlice,
  ModelState,
  selectModelLoadingProgress,
} from "./model-slice";
import { ModelWithMetadata } from "./types";
import LoadingSteps from "./LoadingSteps";

const { reducer, actions } = modelSlice;

const initialState: ModelState = {
  models: [],
  exampleProjects: [],
  finishedSteps: [],
  maxSteps: 1,
};

const EXAMPLE_MODEL: IModelFile = {
  path: "my/test/path",
  name: "My Example Model",
  content: "content of model",
};

const EXAMPLE_MODEL_WITH_METADATA: ModelWithMetadata = {
  model: EXAMPLE_MODEL,
  isErroneous: false,
  isDirty: false,
  lastSavedVersion: 1,
};

describe("model-slice", () => {
  describe("actions", () => {
    test("should add a new model", () => {
      expect(
        reducer(initialState, actions.addModel(EXAMPLE_MODEL)).models
      ).toHaveLength(1);
    });

    test("should have given new model initial metadata", () => {
      expect(
        reducer(initialState, actions.addModel(EXAMPLE_MODEL)).models[0]
      ).toMatchObject({
        isErroneous: false,
        isDirty: false,
        lastSavedVersion: 1,
      });
    });

    test("should remove a model", () => {
      expect(
        reducer(
          {
            ...initialState,
            models: [EXAMPLE_MODEL_WITH_METADATA],
          },
          actions.removeModel(EXAMPLE_MODEL)
        ).models
      ).toHaveLength(0);
    });

    test("should not remove a non-existing model", () => {
      const state = {
        ...initialState,
        models: [EXAMPLE_MODEL_WITH_METADATA],
      };

      expect(
        reducer(
          state,
          actions.removeModel({
            path: "unknown path",
            name: "unknown model",
            content: "unknown content",
          })
        )
      ).toMatchObject(state);
    });

    test("should update a models error state", () => {
      expect(
        reducer(
          {
            ...initialState,
            models: [EXAMPLE_MODEL_WITH_METADATA],
          },
          actions.setErrorStateInModel({
            path: EXAMPLE_MODEL.path,
            isErroneous: true,
          })
        ).models[0]
      ).toMatchObject({
        isErroneous: true,
      });
    });

    test("should not update a non-existing models error state", () => {
      const state = {
        ...initialState,
        models: [EXAMPLE_MODEL_WITH_METADATA],
      };

      expect(
        reducer(
          state,
          actions.setErrorStateInModel({
            path: "unknown path",
            isErroneous: true,
          })
        )
      ).toMatchObject(state);
    });

    test("should reset all error states", () => {
      const state: ModelState = {
        ...initialState,
        models: [
          { ...EXAMPLE_MODEL_WITH_METADATA, isErroneous: true },
          { ...EXAMPLE_MODEL_WITH_METADATA, isErroneous: false },
          { ...EXAMPLE_MODEL_WITH_METADATA, isErroneous: true },
        ],
      };

      expect(
        reducer(state, actions.resetErrors).models.every(
          (model) => model.isErroneous === false
        )
      ).toBeTruthy();
    });

    test("should update a models dirty state", () => {
      expect(
        reducer(
          {
            ...initialState,
            models: [EXAMPLE_MODEL_WITH_METADATA],
          },
          actions.setDirtyStateInModel({
            path: EXAMPLE_MODEL.path,
            isDirty: true,
          })
        ).models[0]
      ).toMatchObject({
        isDirty: true,
      });
    });

    test("should not update a non-existing models dirty state", () => {
      const state = {
        ...initialState,
        models: [EXAMPLE_MODEL_WITH_METADATA],
      };

      expect(
        reducer(
          state,
          actions.setDirtyStateInModel({
            path: "unknown path",
            isDirty: true,
          })
        )
      ).toMatchObject(state);
    });

    test("should reset all dirty states", () => {
      const state: ModelState = {
        ...initialState,
        models: [
          { ...EXAMPLE_MODEL_WITH_METADATA, isDirty: true },
          { ...EXAMPLE_MODEL_WITH_METADATA, isDirty: true },
          { ...EXAMPLE_MODEL_WITH_METADATA, isDirty: false },
        ],
      };

      expect(
        reducer(state, actions.resetDirtyModels).models.every(
          (model) => model.isDirty === false
        )
      ).toBeTruthy();
    });

    test("should update a models version state", () => {
      expect(
        reducer(
          {
            ...initialState,
            models: [EXAMPLE_MODEL_WITH_METADATA],
          },
          actions.setVersionId({
            path: EXAMPLE_MODEL.path,
            lastSavedVersion: 2,
          })
        ).models[0]
      ).toMatchObject({
        lastSavedVersion: 2,
      });
    });

    test("should not update a non-existing models dirty state", () => {
      const state = {
        ...initialState,
        models: [EXAMPLE_MODEL_WITH_METADATA],
      };

      expect(
        reducer(
          state,
          actions.setVersionId({
            path: "unknown path",
            lastSavedVersion: 5,
          })
        )
      ).toMatchObject(state);
    });
  });
  describe("selectors", () => {
    test("should have loading progress of 0", () => {
      expect(
        selectModelLoadingProgress({
          model: initialState,
        } as any)
      ).toBe(0);
    });

    test("should have loading progress of 50", () => {
      expect(
        selectModelLoadingProgress({
          model: {
            ...initialState,
            maxSteps: 2,
            finishedSteps: [LoadingSteps.MODELS_READ],
          },
        } as any)
      ).toBe(50);
    });

    test("should have loading progress of 100", () => {
      expect(
        selectModelLoadingProgress({
          model: {
            ...initialState,
            finishedSteps: [LoadingSteps.MODELS_READ],
          },
        } as any)
      ).toBe(100);
    });
  });
});
