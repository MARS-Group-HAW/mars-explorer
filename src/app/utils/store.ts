import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import projectReducer from "../components/Home/utils/project-slice";
import modelReducer from "../components/Model/utils/model-slice";
import simulationReducer from "../components/QuickStartBar/utils/simulation-slice";
import analyzeReducer from "../components/Analyze/utils/analyze-slice";

const logger = createLogger();

const store = configureStore({
  reducer: {
    project: projectReducer,
    model: modelReducer,
    simulation: simulationReducer,
    analyze: analyzeReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
