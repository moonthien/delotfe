import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: localStorage.getItem("userId") || null, // Parse user object from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    setUser(state, action) {
      state.user = action.payload; // Store the entire user object
      localStorage.setItem("userId", action.payload); // KHÔNG cần JSON.stringify // Save user object to localStorage
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("studentId");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("selectedStudent");
    },
  },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
