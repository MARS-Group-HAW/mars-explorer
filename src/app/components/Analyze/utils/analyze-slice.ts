import { createSlice, freeze, PayloadAction } from "@reduxjs/toolkit";
import { IFileRef } from "@shared/types/File";
import type { RootState } from "../../../utils/store";
import ResultData, {
  ResultDataPerObject,
  ResultDataWithMeta,
} from "./ResultData";

type State = ResultDataPerObject;

const initialResultDataWithMeta: Omit<ResultDataWithMeta, "file"> = {
  data: [],
  isLoading: false,
  hasCompleted: false,
};

// Define the initial state using that type
const initialState: State = {};

export const analyzeSlice = createSlice({
  name: "analyze",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setResultFiles: (state, action: PayloadAction<{ files: IFileRef[] }>) => {
      action.payload.files.forEach((file) => {
        state[file.name] = {
          file: file.path,
          data: [],
          isLoading: false,
          hasCompleted: false,
        };
      });
    },
    setData: (
      state,
      action: PayloadAction<{ name: string; data: ResultData }>
    ) => {
      const { name, data } = action.payload;
      state[name].data = data;
    },
    addData: (
      state,
      action: PayloadAction<{ name: string; data: ResultData }>
    ) => {
      const { name, data } = action.payload;
      const frozeObj = freeze(data);
      state[name].isLoading = true;
      state[name].hasCompleted = false;
      state[name].data.push(...frozeObj);
    },
    setDataLoadingCompleted: (
      state,
      action: PayloadAction<{ name: string }>
    ) => {
      const { name } = action.payload;
      state[name].isLoading = false;
      state[name].hasCompleted = true;
    },
    resetAll: () => initialState,
    resetData: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      const { file } = state[name];
      const newState = {
        ...state,
        [name]: {
          file,
          ...initialResultDataWithMeta,
        },
      };

      return newState;
    },
  },
});

export const {
  setResultFiles,
  setData,
  addData,
  setDataLoadingCompleted,
  resetAll,
  resetData,
} = analyzeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAnalyzeData = (state: RootState) => state.analyze;
export const selectKeys = (state: RootState) => Object.keys(state.analyze);
export const selectLoadingFiles = (state: RootState) =>
  Object.keys(state.analyze).filter((file) => state.analyze[file].isLoading);
export const selectAnalyzeAnyFileFetching = (state: RootState) =>
  Object.values(state.analyze).some((file) => file.isLoading);
export const selectCompletedData = (state: RootState) =>
  Object.keys(state.analyze).filter((key) => state.analyze[key].hasCompleted) ||
  [];

export default analyzeSlice.reducer;
