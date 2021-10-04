import { createAction, createReducer } from "@reduxjs/toolkit";
import { createReducerContext } from "react-use";
import FieldNames from "../utils/fieldNames";

export const setObjectNamespace = createAction<
  { namespace: FieldNames.AGENTS | FieldNames.LAYERS },
  "setObjectNamespace"
>("setObjectNamespace");
export const setMappingNamespace = createAction<number, "setMappingNamespace">(
  "setMappingNamespace"
);

type State = {
  objectNsp?: FieldNames.AGENTS | FieldNames.LAYERS;
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
);

export const selectObjectAtIndex = (state: State) =>
  `${state.objectNsp}[${state.mappingIndex}]`;

export const [useSharedMappings, SharedMappingsProvider] = createReducerContext(
  reducer,
  initialState
);
