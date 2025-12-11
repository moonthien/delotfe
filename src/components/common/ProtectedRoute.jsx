import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "../../redux/slice/adminAuthSlice";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Lấy thông tin admin authentication
  const { isAuthenticated: isAdminAuthenticated, adminToken } = useSelector(
    (state) => state.adminAuth
  );

  // Lấy thông tin từ localStorage
  const userInfoFromStorage = localStorage.getItem("userInfo");
  const adminInfoFromStorage = localStorage.getItem("adminInfo");

  let userInfo = null;
  let adminInfoLocal = null;

  try {
    userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;
    adminInfoLocal = adminInfoFromStorage
      ? JSON.parse(adminInfoFromStorage)
      : null;
  } catch {
    userInfo = null;
    adminInfoLocal = null;
  }

  useEffect(() => {
    // Kiểm tra authentication khi component mount
    dispatch(checkAuth());
  }, [dispatch]);

  // Ưu tiên: Nếu có adminInfo thì coi như admin đã đăng nhập
  if (adminInfoLocal && adminInfoLocal.role === "admin") {
    if (adminToken && isAdminAuthenticated) {
      return children; // Admin đã đăng nhập đầy đủ
    } else {
      return <Navigate to="/loginAdmin" state={{ from: location }} replace />;
    }
  }

  // Nếu có userInfo nhưng không phải admin
  if (userInfo && userInfo.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu không có thông tin gì
  if (!adminInfoLocal && !userInfo) {
    return <Navigate to="/loginAdmin" state={{ from: location }} replace />;
  }

  // Fallback
  return <Navigate to="/loginAdmin" state={{ from: location }} replace />;
};

export default ProtectedRoute;
