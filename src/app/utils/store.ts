import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import projectReducer from "../components/Home/utils/project-slice";
import modelReducer from "../components/Model/utils/model-slice";
import configReducer from "../components/Configure/utils/config-slice";
import simulationReducer from "../components/QuickStartBar/utils/simulation-slice";

const logger = createLogger({
  collapsed: true,
  predicate: (getState, action) => !action.type.startsWith("simulation"),
});

const store = configureStore({
  reducer: {
    project: projectReducer,
    model: modelReducer,
    config: configReducer,
    simulation: simulationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
