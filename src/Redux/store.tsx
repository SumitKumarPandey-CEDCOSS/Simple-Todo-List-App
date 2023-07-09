import { createStore } from "redux";
import { taskReducer } from "./Reducer";

export const store = createStore(taskReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
