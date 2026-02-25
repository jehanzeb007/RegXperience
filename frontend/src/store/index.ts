import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice";
import assessmentReducer from "./assessmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    assessment: assessmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
