import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import {
  GlobalStyle,
  Wrapper,
  FullscreenContainer,
  LoginContainer,
  Logo,
  Cloud,
  Cloud2,
  FormGroup,
  InputWrapper,
  Input,
  Label,
  InputIcon,
  Button,
  ForgotPassword,
  RegisterLink,
  HomeCircle,
} from "./styles/LoginPage.styles";
import { loginUser, sendOtp, verifyOtp, getMyStudents } from "../services/apiService";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [usernameOrEmailFocused, setUsernameOrEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  // OTP modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // === LOGIN ===
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(usernameOrEmail, password);
      const accessToken = res.data.data.accessToken;
      const user = res.data.data.user;

      // ✅ Gọi hook useAuth để lưu accessToken, userId, userInfo... như bạn hiện tại
      login(accessToken, user);

      // ✅ Lấy danh sách học sinh
      const studentsRes = await getMyStudents();
      const students = studentsRes.data?.data || [];
    
      if (students.length > 0) {
        // Có học sinh rồi → lưu thông tin học sinh đầu tiên
        const student = students[0];
        localStorage.setItem("studentId", student._id);
        localStorage.setItem(
          "selectedStudent",
          JSON.stringify({
            id: student._id,
            name: student.name,
            class: student.class,
            nuts: student.nuts || 0,
            avatar:
              student.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
          })
        );

        // ✅ Chuyển thẳng về trang chủ
        toast.success(`🎉 Chào mừng trở lại, ${student.name}!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        // Không có học sinh → sang trang thêm học sinh
        toast.info("👋 Bạn chưa có học sinh nào, hãy thêm mới nhé!");
        window.location.href = "/manage-profiles";
      }
    } catch (err) {
      const message = err.response?.data?.message || "Đăng nhập thất bại";
      console.error("❌ Login error:", message);

      // ✅ Nếu tài khoản chưa xác minh
      if (
        message.includes("Email chưa được xác minh") ||
        message.includes("Tài khoản chưa được xác minh")
      ) {
        setShowOtpModal(true);
        toast.info("Tài khoản chưa được xác minh. Đang gửi mã OTP...");
        handleSendOtp();
      } else {
        toast.error(message);
      }
    }
  };

  // === OTP FUNCTIONS ===
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      const updated = [...otpCode];
      updated[index] = value;
      setOtpCode(updated);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // const handleSendOtp = async () => {
  //   try {
  //     const data = { email: usernameOrEmail, username: usernameOrEmail };
  //     await sendOtp(data);
  //     toast.success("✅ Mã OTP đã được gửi tới email!");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Không gửi được OTP");
  //   }
  // };
  const handleSendOtp = async () => {
    try {
      await sendOtp({ username: usernameOrEmail }); // ✅ chỉ gửi username
      toast.success("Mã OTP đã được gửi tới email liên kết!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không gửi được OTP");
    }
  };

  const handleOtpConfirm = async () => {
    if (otpCode.some((digit) => digit === "")) {
      toast.error("Vui lòng nhập đủ 6 số OTP!");
      return;
    }

    setLoading(true);
    try {
      const otpString = otpCode.join("");
      await verifyOtp({ username: usernameOrEmail, otpCode: otpString });
      toast.success("🎉 Xác minh thành công! Vui lòng đăng nhập lại.");
      setShowOtpModal(false);
      setOtpCode(["", "", "", "", "", ""]);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xác minh OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <FullscreenContainer>
          <Cloud src="/cloudy1.png" alt="cloud" />
          <Cloud2 src="/cloudy2.png" alt="cloud2" />
          <LoginContainer>
            <Logo src="/logo.png" alt="Logo" />
            <form onSubmit={handleLogin}>
              {/* Username or Email */}
              <FormGroup>
                <InputWrapper>
                  <Input
                    id="usernameOrEmail"
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    onFocus={() => setUsernameOrEmailFocused(true)}
                    onBlur={() => setUsernameOrEmailFocused(false)}
                    placeholder=" "
                    required
                  />
                  <Label
                    htmlFor="usernameOrEmail"
                    className={usernameOrEmailFocused || usernameOrEmail ? "active" : ""}
                  >
                    Tài khoản
                  </Label>
                </InputWrapper>
              </FormGroup>

              {/* Password */}
              <FormGroup>
                <InputWrapper>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder=" "
                    required
                  />
                  <Label
                    htmlFor="password"
                    className={passwordFocused || password ? "active" : ""}
                  >
                    Mật khẩu
                  </Label>
                  <InputIcon onClick={() => setShowPassword(!showPassword)}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#999"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                      ) : (
                        <>
                          <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0"></path>
                          <path d="M21 12c-2.4 4-5.4 6-9 6-3.6 0-6.6-2-9-6 2.4-4 5.4-6 9-6 3.6 0 6.6 2 9 6"></path>
                        </>
                      )}
                    </svg>
                  </InputIcon>
                </InputWrapper>
                <ForgotPassword>
                  <a href="/quen-mat-khau">Quên mật khẩu?</a>
                </ForgotPassword>
              </FormGroup>

              <Button type="submit">Đăng nhập</Button>
              <RegisterLink>
                Bạn chưa có tài khoản?{" "}
                <a href="/dang-ky">
                  <strong>Đăng ký</strong>
                </a>
              </RegisterLink>
              <HomeCircle onClick={() => (window.location.href = "/")}>
                <FiHome size={24} />
                <span className="home-text">Trang chủ</span>
              </HomeCircle>
            </form>
          </LoginContainer>
        </FullscreenContainer>
      </Wrapper>

      {/* Modal OTP */}
      {showOtpModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              width: "400px",
              maxWidth: "90%",
              textAlign: "center",
            }}
          >
            <h3>Xác minh tài khoản</h3>
            <p>Nhập mã OTP đã được gửi qua email</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                margin: "16px 0",
              }}
            >
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  style={{
                    width: "40px",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "20px",
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
            <button onClick={handleSendOtp} style={{ marginRight: "10px" }}>
              Gửi lại OTP
            </button>
            <button onClick={handleOtpConfirm} disabled={loading}>
              {loading ? "Đang xác nhận..." : "Xác nhận"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
}

export default LoginPage;
