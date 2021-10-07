import { createAction, createReducer } from "@reduxjs/toolkit";
import { createReducerContext } from "react-use";
import { IModelFile } from "@shared/types/Model";
import ExampleProject from "@shared/types/ExampleProject";

export const selectModel = createAction<
  { model: IModelFile; isExample?: boolean },
  "selectModel"
>("selectModel");
export const selectExampleProject = createAction<
  { project: ExampleProject },
  "selectExampleProject"
>("selectExampleProject");
export const deselectExampleProject = createAction<"deselectExampleProject">(
  "deselectExampleProject"
);
export const openModelDeletion = createAction<
  { model: IModelFile },
  "openModelDeletion"
>("openModelDeletion");
export const closeModelDeletion = createAction<void, "closeModelDeletion">(
  "closeModelDeletion"
);
export const openModelCreation = createAction<void, "startModelCreation">(
  "startModelCreation"
);
export const closeModelCreation = createAction<void, "closeModelCreation">(
  "closeModelCreation"
);

type State = {
  isCreateDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isExampleProject: boolean;
  selectedModel?: IModelFile;
  selectedExampleProject?: ExampleProject;
  processedModel?: IModelFile;
};

const initialState: State = {
  isCreateDialogOpen: false,
  isDeleteDialogOpen: false,
  isExampleProject: false,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(selectModel, (state, { payload }) => {
      const { model, isExample } = payload;
      state.selectedModel = model;
      state.isExampleProject = isExample;
    })
    .addCase(selectExampleProject, (state, { payload }) => {
      const { project } = payload;
      state.selectedExampleProject = project;
    })
    .addCase(deselectExampleProject, (state) => {
      state.selectedExampleProject = undefined;
    })
    .addCase(openModelDeletion, (state, { payload }) => {
      const { model } = payload;
      state.processedModel = model;
      state.isDeleteDialogOpen = true;
    })
    .addCase(closeModelDeletion, (state) => {
      state.processedModel = undefined;
      state.isDeleteDialogOpen = false;
    })
    .addCase(openModelCreation, (state) => {
      state.isCreateDialogOpen = true;
    })
    .addCase(closeModelCreation, (state) => {
      state.isCreateDialogOpen = false;
    })
);

export const [useSharedModels, SharedModelsProvider] = createReducerContext(
  reducer,
  initialState
);
