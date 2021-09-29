import { createAction, createReducer } from "@reduxjs/toolkit";
import { createReducerContext } from "react-use";

export const add = createAction<{ name: string }, "add">("add");
export const toggle = createAction<{ name: string }, "toggle">("toggle");

type ObjectWithCheckedStatus = {
  name: string;
  isChecked: boolean;
}[];

type State = ObjectWithCheckedStatus;

const initialState: State = [];

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(add, (state, { payload }) => {
      const { name } = payload;

      if (state.find((obj) => obj.name === name)) return;

      state.push({
        name,
        isChecked: false,
      });
    })
    .addCase(toggle, (state, { payload }) => {
      const { name } = payload;

      const indexOfObject = state.findIndex((obj) => obj.name);

      if (indexOfObject === -1) {
        window.api.logger.warn("Object to toggle was not found: ", name);
        return;
      }

      state[indexOfObject].isChecked = !state[indexOfObject].isChecked;
    })
);

export const isCheckedByName = (state: State, name: string) =>
  state.find((obj) => obj.name === name)?.isChecked;

export const [useSharedObjectsWithStatus, SharedObjectsWithStatusProvider] =
  createReducerContext(reducer, initialState);
