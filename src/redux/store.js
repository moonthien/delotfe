import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import adminAuthReducer from "./slice/adminAuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },
});

export default store;
