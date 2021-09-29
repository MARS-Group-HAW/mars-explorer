import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../components/Home/utils/project-slice";
import modelReducer from "../components/Model/utils/model-slice";
import simulationReducer from "../components/QuickStartBar/utils/simulation-slice";

const store = configureStore({
  reducer: {
    project: projectReducer,
    model: modelReducer,
    simulation: simulationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
