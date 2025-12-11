// src/hooks/useAuth.js
import { useState, useEffect } from "react";

export default function useAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("userId");
    const info = localStorage.getItem("userInfo");

    setAccessToken(token);
    setUserId(id);
    setUserInfo(info ? JSON.parse(info) : null);
  }, []);

  const login = (token, user) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", user._id || user.id);
    localStorage.setItem("userInfo", JSON.stringify(user));

    setAccessToken(token);
    setUserId(user._id || user.id);
    setUserInfo(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedStudent");
    setAccessToken(null);
    setUserId(null);
    setUserInfo(null);
    window.location.href = "/login";
  };

  return { accessToken, userId, userInfo, login, logout };
}
