import { ModelRef } from "@shared/types/Model";
import { projectSlice, ProjectState } from "./project-slice";
import LocalStorageService, {
  CacheKey,
} from "../../../utils/local-storage-service";

const { reducer, actions } = projectSlice;

const initialState: ProjectState = {};

describe("project-slice", () => {
  describe("actions", () => {
    test("should set new project in local storage", () => {
      const myProject: ModelRef = {
        name: "My Project",
        path: "My Path",
      };

      const newState = reducer(initialState, actions.setProject(myProject));

      expect(newState.name).toEqual(myProject.name);
      expect(newState.path).toEqual(myProject.path);
      expect(LocalStorageService.getItem(CacheKey.LAST_PATH)).toEqual(
        myProject.path
      );
    });

    test("should reset the last project", () => {
      const newState = reducer(initialState, actions.resetProject);
      expect(newState).toEqual({});
      expect(LocalStorageService.getItem(CacheKey.LAST_PATH)).toBeFalsy();
    });
  });
  describe("selectors", () => {});
});
