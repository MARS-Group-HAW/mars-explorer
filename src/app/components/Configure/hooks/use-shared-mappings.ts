import { createAction, createReducer } from "@reduxjs/toolkit";
import { createReducerContext } from "react-use";
import FieldNames from "../utils/fieldNames";

type TypeNamespaces =
  | FieldNames.AGENTS
  | FieldNames.LAYERS
  | FieldNames.ENTITIES;

export const setObjectNamespace = createAction<
  { namespace: TypeNamespaces },
  "setObjectNamespace"
>("setObjectNamespace");
export const setMappingNamespace = createAction<number, "setMappingNamespace">(
  "setMappingNamespace"
);
export const resetMappingNamespace = createAction<
  number,
  "resetMappingNamespace"
>("resetMappingNamespace");

type State = {
  objectNsp: TypeNamespaces;
  mappingIndex?: number;
};

const initialState: State = {
  objectNsp: FieldNames.AGENTS,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setObjectNamespace, (state, { payload }) => {
      const { namespace } = payload;
      state.objectNsp = namespace;
      state.mappingIndex = undefined;
    })
    .addCase(setMappingNamespace, (state, { payload }) => {
      state.mappingIndex = payload;
    })
    .addCase(resetMappingNamespace, (state) => {
      state.mappingIndex = undefined;
    })
);

export const selectObjectAtIndex = (state: State) =>
  `${state.objectNsp}[${state.mappingIndex}]`;

export const [useSharedMappings, SharedMappingsProvider] = createReducerContext(
  reducer,
  initialState
);
