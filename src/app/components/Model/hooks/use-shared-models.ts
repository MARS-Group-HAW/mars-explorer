import { createAction, createReducer } from "@reduxjs/toolkit";
import { createReducerContext } from "react-use";
import { IModelFile } from "@shared/types/Model";

export const selectModel = createAction<{ model: IModelFile }, "selectModel">(
  "selectModel"
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
  selectedModel?: IModelFile;
  processedModel?: IModelFile;
};

const initialState: State = {
  isCreateDialogOpen: false,
  isDeleteDialogOpen: false,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(selectModel, (state, { payload }) => {
      const { model } = payload;
      state.selectedModel = model;
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
