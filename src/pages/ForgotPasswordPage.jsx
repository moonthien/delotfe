import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { sendOtp, forgotPassword } from "../services/apiService";

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // === GỬI OTP ===
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Vui lòng nhập tên đăng nhập!");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(username, "forgot"); // ✅ backend chỉ cần username + purpose
      alert("✅ Mã OTP đã được gửi đến email của tài khoản này!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Không gửi được OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // === XÁC NHẬN OTP / ĐẶT LẠI MẬT KHẨU ===
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      alert("Vui lòng nhập mã OTP!");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(username, otpCode); // ✅ backend dùng username + otpCode
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Xác nhận OTP thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Illustration src="/assets/mailbox_1.png" alt="Forgot password" />
          <Title>Quên mật khẩu?</Title>
          <Subtitle>
            Nhập tên tài khoản đã xác minh để nhận mã OTP đặt lại mật khẩu
          </Subtitle>

          {step === 1 ? (
            <Form onSubmit={handleSendOtp}>
              <Label>Tên đăng nhập</Label>
              <Input
                type="text"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleForgotPassword}>
              <Label>Mã OTP</Label>
              <Input
                type="text"
                placeholder="Nhập mã OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xác nhận..." : "Xác nhận OTP"}
              </Button>
            </Form>
          )}

          <BackLink href="/dang-nhap">
            <AiOutlineArrowLeft style={{ marginRight: "6px" }} /> Đăng nhập
          </BackLink>
        </Card>
      </Container>

      {/* === MODAL THÔNG BÁO === */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalContent>
            <Title style={{ fontSize: "20px", marginBottom: "16px" }}>
              ✅ Mật khẩu mới đã được gửi vào email của bạn!
            </Title>
            <Button
              style={{ maxWidth: "200px", margin: "0 auto" }}
              onClick={() => (window.location.href = "/dang-nhap")}
            >
              Xác nhận
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ForgotPasswordPage;

/* =============== CSS =============== */

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0; padding: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: #fff;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #fff;
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  padding: 40px 20px;
  text-align: center;
`;

const Illustration = styled.img`
  width: 220px;
  max-width: 100%;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #2f3542;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  text-align: left;
  font-size: 18px;
  color: #2f3542;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #dcdcdc;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  &:focus {
    border-color: #4caf50;
  }
`;

const Button = styled.button`
  padding: 14px 0;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  &:hover {
    opacity: 0.9;
  }
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  color: #2f3542;
  font-size: 18px;
  text-decoration: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
`;
