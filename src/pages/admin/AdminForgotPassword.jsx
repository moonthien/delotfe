import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { toast } from "react-toastify";
import { sendOtp, forgotPassword } from "../../services/apiService";

// Styled Components tương tự Login page
const LoginContainer = styled.div`
  min-height: 100vh;
  background: #1a2038;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  background: #161c37;
  color: white;
  padding: 2rem;
  text-align: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  .logo-icon {
    width: 32px;
    height: 32px;
    background: #3b82f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
  }

  .logo-text {
    font-size: 26px;
    font-weight: 800;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin: 0.5rem 0 0 0;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #6b7280;

  &:hover {
    background: #4b5563;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;

  ${(props) =>
    props.active &&
    `
    background: #3b82f6;
    color: white;
  `}

  ${(props) =>
    props.completed &&
    `
    background: #10b981;
    color: white;
  `}
  
  ${(props) =>
    !props.active &&
    !props.completed &&
    `
    background: #e5e7eb;
    color: #6b7280;
  `}
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.adminAuth);

  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    otpCode: "",
  });
  const [errors, setErrors] = useState({});

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.username) {
      newErrors.username = "Username là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.otpCode) {
      newErrors.otpCode = "Mã OTP là bắt buộc";
    } else if (formData.otpCode.length !== 6) {
      newErrors.otpCode = "Mã OTP phải có 6 số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsLoading(true);
    try {
      await sendOtp(formData.username, "forgot-password");
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setStep(2);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi gửi OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      await forgotPassword(formData.username, formData.otpCode, formData.email);
      toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
      navigate("/loginAdmin");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Form onSubmit={handleStep1Submit}>
      <FormGroup>
        <Label>Email Admin</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Nhập email admin của bạn"
          className={errors.email ? "error" : ""}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>Username</Label>
        <Input
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          placeholder="Nhập username admin của bạn"
          className={errors.username ? "error" : ""}
        />
        {errors.username && <ErrorText>{errors.username}</ErrorText>}
      </FormGroup>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
      </Button>
    </Form>
  );

  const renderStep2 = () => (
    <Form onSubmit={handleStep2Submit}>
      <p
        style={{ textAlign: "center", color: "#6b7280", marginBottom: "1rem" }}
      >
        Mã OTP đã được gửi đến email: <strong>{formData.email}</strong>
      </p>

      <FormGroup>
        <Label>Mã OTP</Label>
        <Input
          type="text"
          value={formData.otpCode}
          onChange={(e) => handleInputChange("otpCode", e.target.value)}
          placeholder="Nhập mã OTP 6 số"
          maxLength="6"
          className={errors.otpCode ? "error" : ""}
        />
        {errors.otpCode && <ErrorText>{errors.otpCode}</ErrorText>}
      </FormGroup>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Xác nhận và đặt lại mật khẩu"}
      </Button>

      <SecondaryButton type="button" onClick={() => setStep(1)}>
        Quay lại
      </SecondaryButton>
    </Form>
  );

  return (
    <LoginContainer>
      <Card>
        <Header>
          <Logo>
            <div className="logo-icon">M</div>
            <div className="logo-text">MatX Pro</div>
          </Logo>
          <Title>Quên mật khẩu Admin</Title>
          <Subtitle>
            {step === 1 && "Nhập thông tin để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP để đặt lại mật khẩu"}
          </Subtitle>
        </Header>

        <Content>
          <StepIndicator>
            <Step active={step === 1} completed={step > 1}>
              1
            </Step>
            <Step active={step === 2}>2</Step>
          </StepIndicator>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}

          <BackLink to="/loginAdmin">← Quay lại đăng nhập</BackLink>
        </Content>
      </Card>
    </LoginContainer>
  );
};

export default AdminForgotPassword;
