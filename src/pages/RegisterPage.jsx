import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GlobalStyle, Wrapper, FullscreenContainer, RegisterContainer, Logo,
  Cloud, Cloud2, FormGroup, InputWrapper, EmailRow, Input, Label, InputIcon,
  Button, LoginLink, ModalOverlay, ModalContent, ModalButton, CodeInputRow,
  CodeInput, ErrorMessage
} from './styles/RegisterPage.styles';
import { registerUser, sendOtp, verifyOtp } from "../services/apiService";

// ===== Component =====
function RegisterPage() {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [confirmpassword, setConfirmPassword] = useState('');
  const [confirmpasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);

  const [phone, setPhone] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);

  const usernameIsValid = /^[a-zA-Z0-9]+$/.test(username);
  const passwordIsValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{8,}$/.test(password);
  const confirmpasswordIsValid = password === confirmpassword;
  const emailIsValid = /^[^\s@]+@gmail\.com$/.test(email);
  const phoneIsValid = /^(0[0-9]{9})$/.test(phone.trim());

  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const showError = (message) => {
    setErrorModalMessage(message);
    setShowErrorModal(true);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validate input
    if (!username.trim() || !password || !confirmpassword || !email.trim() || !phone.trim()) {
      return showError("Vui lòng điền đầy đủ thông tin");
    }
    if (!usernameIsValid) return showError("Username không hợp lệ");
    if (!passwordIsValid) return showError("Password không hợp lệ");
    if (!confirmpasswordIsValid) return showError("Xác nhận mật khẩu không khớp");
    if (!emailIsValid) return showError("Email phải có dạng @gmail.com");
    if (!phoneIsValid) return showError("Số điện thoại không hợp lệ. Ví dụ: 0912345678");

    setLoading(true);

    // 1. Gọi API đăng ký
    registerUser({
      username,
      phoneNumber: "+84" + phone.slice(1),
      email,
      password
    })
      .then((resRegister) => {
        toast.success(resRegister.data.message || "Đăng ký thành công, vui lòng xác minh email!");
        // 2. Gửi OTP
        return sendOtp(username, "verify");
      })
      .then(() => {
        toast.info("Mã OTP đã được gửi đến email của bạn");
        // 3. Mở modal nhập OTP
        setShowOtpModal(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Đăng ký thất bại");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Tạo hàm handleOtpChange:
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

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      setOtpCode(pastedData.split('').slice(0, 6));
      document.getElementById('otp-5')?.focus();
    } else {
      toast.error("Mã OTP phải gồm 6 chữ số!");
    }
  };


  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpConfirm = () => {
    if (otpCode.some((digit) => digit === "")) {
      toast.error("Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    setLoading(true);

    const otpString = otpCode.join("");
    verifyOtp(username, otpString)
    .then((resVerify) => {
      toast.success(resVerify.data.message || "Xác minh OTP thành công");
      setShowOtpModal(false);
      setShowSuccessModal(true);
    })
    .catch((err) => {
      toast.error(err.response?.data?.message || "Xác minh OTP thất bại");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <FullscreenContainer>
          <Cloud src="/cloudy1.png" alt="cloud" />
          <Cloud2 src="/cloudy2.png" alt="cloud2" />
          <RegisterContainer>
            <Logo src="/logo.png" alt="Logo" />
            <form onSubmit={handleRegister}>
              <FormGroup>
                <InputWrapper>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                    placeholder=" "
                    
                    $invalid={username && !usernameIsValid}
                  />
                  <Label
                    htmlFor="username"
                    className={usernameFocused || username ? 'active' : ''}
                    $invalid={username && !usernameIsValid}
                  >
                    Tên người dùng
                  </Label>
                  <InputIcon>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M6.5 17.5c1.5-2 4-3 5.5-3s4 1 5.5 3" />
                    </svg>
                  </InputIcon>
                </InputWrapper>
                { username && !usernameIsValid && (
                  <ErrorMessage>
                    Tên người dùng không hợp lệ. Ví dụ: nguyenvana123
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <InputWrapper>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder=" "
                    
                    $invalid={password && !passwordIsValid}
                  />
                  <Label
                    htmlFor="password"
                    className={passwordFocused || password ? 'active' : ''}
                    $invalid={password && !passwordIsValid}
                  >
                    Mật khẩu
                  </Label>
                  <InputIcon onClick={() => setShowPassword(!showPassword)}>
                    {/* Eye icon SVG here */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                { password && !passwordIsValid && (
                  <ErrorMessage>
                    Mật khẩu không hợp lệ. Ví dụ: Nguyena@123
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <InputWrapper>
                  <Input
                    id="confirmpassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    placeholder=" "
                    
                    $invalid={confirmpassword && !confirmpasswordIsValid}
                  />
                  <Label
                    htmlFor="confirmpassword"
                    className={confirmpasswordFocused || confirmpassword ? 'active' : ''}
                    $invalid={confirmpassword && !confirmpasswordIsValid}
                  >
                    Nhập lại mật khẩu
                  </Label>
                  <InputIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {/* Eye icon SVG here */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showConfirmPassword ? (
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
                {confirmpassword && !confirmpasswordIsValid && (
                  <ErrorMessage>Mật khẩu xác nhận không khớp</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <InputWrapper>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  placeholder=" "
                  $invalid={phone && !phoneIsValid}
                />
                <Label
                  htmlFor="phone"
                  className={phoneFocused || phone ? 'active' : ''}
                  $invalid={phone && !phoneIsValid}
                >
                  Số điện thoại
                </Label>
                <InputIcon>
                {/* Phone icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.81.37 1.59.73 2.32a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.76-1.27a2 2 0 0 1 2.11-.45c.73.36 1.51.61 2.32.73A2 2 0 0 1 22 16.92z" />
                </svg>
                </InputIcon>
                </InputWrapper>
                {phone && !phoneIsValid && (
                  <ErrorMessage>
                    Số điện thoại không hợp lệ. Ví dụ: 0912345678
                  </ErrorMessage>
                )}
              </FormGroup>


              <FormGroup>
                <EmailRow>
                  <InputWrapper style={{ flex: 1 }}>
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder=" "
                      
                      $invalid={email && !emailIsValid}
                    />
                    <Label
                      htmlFor="email"
                      className={emailFocused || email ? 'active' : ''}
                      $invalid={email && !emailIsValid}
                    >
                      Email
                    </Label>
                    <InputIcon>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </InputIcon>
                  </InputWrapper>
                  
                </EmailRow>
                { email && !emailIsValid && (
                    <ErrorMessage>
                      Email không hợp lệ. Ví dụ: nguyenvan@gmail.com
                    </ErrorMessage>
                )}
              </FormGroup>

              <Button type="submit" disabled={loading}>
                 {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
              <LoginLink>
                Bạn đã có tài khoản? <a href="/dang-nhap"><strong>Đăng nhập</strong></a>
              </LoginLink>
            </form>
          </RegisterContainer>
        </FullscreenContainer>

        {showOtpModal && (
          <ModalOverlay>
            <ModalContent>
              <p>Vui lòng nhập mã OTP đã gửi ở Email</p>
              <CodeInputRow>
                {otpCode.map((digit, index) => (
                  <CodeInput
                    key={index}
                    id={`otp-${index}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </CodeInputRow>
              <ModalButton onClick={handleOtpConfirm} disabled={loading}>
                {loading ? "Đang xác nhận..." : "Xác nhận"}
              </ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showSuccessModal && (
          <ModalOverlay>
            <ModalContent>
              <p>Đăng ký thành công!</p>
              <ModalButton onClick={() => window.location.href = "/dang-nhap"}>Xác nhận</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showErrorModal && (
          <ModalOverlay>
            <ModalContent>
              <p style={{ whiteSpace: 'pre-line' }}>{errorModalMessage}</p>
              <ModalButton onClick={() => setShowErrorModal(false)}>OK</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
        <ToastContainer position="top-center" autoClose={1000} />
      </Wrapper>
    </>
  );
}

export default RegisterPage;