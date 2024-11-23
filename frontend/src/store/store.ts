import { configureStore } from "@reduxjs/toolkit";
import engineReducer from "./slices/engine/";

export const store = configureStore({
  reducer: {
    engine: engineReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
