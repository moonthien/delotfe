import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { GlobalStyle } from "../../pages/styles/HomePage.styles";
import { adminLogin, clearError } from "../../redux/slice/adminAuthSlice";
import { toast } from "react-toastify";

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  background: #1a2038;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: #161c37;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 500px;
`;

const RightPanel = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

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
  font-size: 18px;
  font-weight: 500;
  margin: 1.5rem 0;
  line-height: 1.3;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeatureItem = styled.div`
  position: relative;
  padding-left: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 4px;
    height: 4px;
    background: #ef4444;
    border-radius: 50%;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  a {
    font-size: 14px;
    opacity: 0.8;
    text-decoration: none;
    color: white;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f9fafb;
  }

  .google-icon {
    width: 20px;
    height: 20px;
    background: #dc2626;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  span {
    font-size: 14px;
    color: #6b7280;
  }
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

const CheckboxGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  label {
    font-size: 14px;
    color: #374151;
    cursor: pointer;
  }
`;

const ForgotLink = styled(NavLink)`
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
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

export default function FirebaseLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.adminAuth
  );

  const [formData, setFormData] = useState({
    email: "", // Để trống để user tự nhập
    password: "",
    remember: true,
  });
  const [validationErrors, setValidationErrors] = useState({});

  // URL để chuyển hướng sau khi đăng nhập thành công
  const from = location.state?.from?.pathname || "/admin";

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear Redux error khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Hiển thị lỗi từ Redux state
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid Email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be 6 character length";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        adminLogin({
          usernameOrEmail: formData.email,
          password: formData.password,
        })
      );

      if (adminLogin.fulfilled.match(resultAction)) {
        toast.success("Đăng nhập thành công!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error sẽ được xử lý bởi Redux state và useEffect
    }
  };

  return (
    <>
      <GlobalStyle />
      <LoginContainer>
        <Card>
          {/* Left side - Branding */}
          <LeftPanel>
            <Logo>
              <div className="logo-icon">M</div>
              <div className="logo-text">MatX Pro</div>
            </Logo>

            <Title>Admin Dashboard</Title>

            <FeatureList>
              <FeatureItem>JWT, Firebase & Auth0 Authentication</FeatureItem>
              <FeatureItem>Clean & Organized code</FeatureItem>
              <FeatureItem>Limitless Pages & Components</FeatureItem>
            </FeatureList>

            <Spacer />

            <Footer>
              <a
                href="https://ui-lib.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by UI Lib
              </a>
            </Footer>
          </LeftPanel>

          {/* Right side - Login Form */}
          <RightPanel>
            {/* Login Form */}
            <Form onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={validationErrors.email ? "error" : ""}
                />
                {validationErrors.email && (
                  <ErrorText>{validationErrors.email}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter your password"
                  className={validationErrors.password ? "error" : ""}
                />
                {validationErrors.password && (
                  <ErrorText>{validationErrors.password}</ErrorText>
                )}
              </FormGroup>

              <CheckboxGroup>
                <CheckboxWrapper>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.remember}
                    onChange={(e) =>
                      handleInputChange("remember", e.target.checked)
                    }
                  />
                  <label htmlFor="remember">Remember Me</label>
                </CheckboxWrapper>
                <ForgotLink to="/admin-forgot-password">
                  Forgot password?
                </ForgotLink>
              </CheckboxGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </SubmitButton>
            </Form>
          </RightPanel>
        </Card>
      </LoginContainer>
    </>
  );
}
