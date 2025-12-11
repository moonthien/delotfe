// src/services/api.js
import axios from "axios";
import { Mutex } from "async-mutex";
import store from "../redux/store";
import { setAccessToken, logout } from "../redux/slice/authSlice";
import { getApiBaseUrl } from "../utils/urlConfig";

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Bắt buộc để gửi cookie chứa refreshToken
  headers: {
    "Content-Type": "application/json",
  },
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

// Hàm refresh token
const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    try {
      const res = await API.post("/auth/refresh"); // API sẽ tự lấy refresh token từ cookie
      console.log("📢 Response từ /auth/refresh:", res.data);

      console.log("📢 Response từ /auth/refresh:", res.data.data?.accessToken);
      if (res.data.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data?.accessToken);
        return res.data.data?.accessToken;
      } else {
        console.log("⚠️ API không trả về accessToken!");
        return null;
      }
    } catch (error) {
      console.error("⛔ Refresh token thất bại!", error);
      return null;
    }
  });
};

// Middleware request: Gắn access token vào header (nếu có)
API.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken || localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Middleware response: Xử lý khi token hết hạn
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      originalRequest.url !== "/auth/login" &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest.headers[NO_RETRY_HEADER] = "true"; // Đánh dấu request đã retry
      const errorStatus = error.response?.data?.status;

      if (errorStatus === "INVALID_TOKEN" || errorStatus === "EXPIRED_TOKEN") {
        console.log("🔴 Token không hợp lệ, đăng xuất...");
        store.dispatch(logout());
        return Promise.reject(error);
      }

      const newToken = await handleRefreshToken();
      if (newToken) {
        store.dispatch(setAccessToken(newToken));
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return API(originalRequest); // Gửi lại request cũ
      } else {
        console.log("🔴 Không thể refresh token, yêu cầu đăng nhập lại!");
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default API;
