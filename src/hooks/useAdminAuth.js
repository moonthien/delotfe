import { useState, useEffect } from "react";

export const useAdminAuth = () => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const info = localStorage.getItem("adminInfo");

    if (token && info) {
      try {
        const parsedInfo = JSON.parse(info);
        setAdminToken(token);
        setAdminInfo(parsedInfo);
        setIsAuthenticated(true);
      } catch {
        // Nếu không parse được, xóa dữ liệu lỗi
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const loginAdmin = (token, adminData) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminInfo", JSON.stringify(adminData));

    setAdminToken(token);
    setAdminInfo(adminData);
    setIsAuthenticated(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");

    setAdminToken(null);
    setAdminInfo(null);
    setIsAuthenticated(false);
  };

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  };

  return {
    adminToken,
    adminInfo,
    isAuthenticated,
    isLoading,
    loginAdmin,
    logoutAdmin,
    checkAdminAuth,
  };
};
