import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../services/apiService";

// Async thunk cho admin login
export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(usernameOrEmail, password);

      // Kiểm tra xem user có role admin không
      const userData = response.data?.data?.user;
      const token = response.data?.data?.accessToken;

      if (!userData || !token) {
        return rejectWithValue("Phản hồi từ server không hợp lệ");
      }

      // Kiểm tra role admin
      if (userData.role !== "admin") {
        return rejectWithValue("Tài khoản không có quyền admin");
      }

      return {
        token, // accessToken từ API
        adminData: userData,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  adminToken: localStorage.getItem("accessToken") || null,
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    loginSuccess(state, action) {
      const { token, adminData } = action.payload;
      state.adminToken = token;
      state.adminInfo = adminData;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Lưu vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("adminInfo", JSON.stringify(adminData));
    },
    logout(state) {
      state.adminToken = null;
      state.adminInfo = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Xóa khỏi localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("adminInfo");
    },
    clearError(state) {
      state.error = null;
    },
    checkAuth(state) {
      const token = localStorage.getItem("accessToken");
      const adminInfo = localStorage.getItem("adminInfo");

      if (token && adminInfo) {
        try {
          state.adminToken = token;
          state.adminInfo = JSON.parse(adminInfo);
          state.isAuthenticated = true;
        } catch {
          // Nếu không parse được, clear authentication
          state.adminToken = null;
          state.adminInfo = null;
          state.isAuthenticated = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("adminInfo");
        }
      } else {
        state.adminToken = null;
        state.adminInfo = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        const { token, adminData } = action.payload;
        state.adminToken = token;
        state.adminInfo = adminData;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        // Lưu vào localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("adminInfo", JSON.stringify(adminData));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setLoading, loginSuccess, logout, clearError, checkAuth } =
  adminAuthSlice.actions;

export default adminAuthSlice.reducer;
