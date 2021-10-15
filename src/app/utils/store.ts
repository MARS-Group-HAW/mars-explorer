import {
  AnyAction,
  combineReducers,
  configureStore,
  createAction,
  Reducer,
} from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import projectReducer from "../components/Home/utils/project-slice";
import modelReducer, {
  initialState,
} from "../components/Model/utils/model-slice";
import configReducer from "../components/Configure/utils/config-slice";
import simulationReducer from "../components/QuickStartBar/utils/simulation-slice";

const logger = createLogger({
  collapsed: true,
  predicate: (getState, action) => !action.type.startsWith("simulation"),
});

const combinedReducer = combineReducers({
  project: projectReducer,
  model: modelReducer,
  config: configReducer,
  simulation: simulationReducer,
});

export const resetStore = createAction<void, "resetStore">("resetStore");

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === resetStore.type) {
    return {
      model: {
        ...initialState,
        exampleProjects: state.model.exampleProjects,
      },
    } as RootState;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof combinedReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
