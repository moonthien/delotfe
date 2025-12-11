import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  min-height: 100vh;
  background: #1a2038;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: white;
`;

const Card = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #374151;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #ef4444;
  margin: 0 0 1rem 0;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1f2937;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const UserInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  color: #475569;

  .user-detail {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .user-role {
    background: #fef3c7;
    color: #92400e;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
    display: inline-block;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.primary {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  // Kiểm tra thông tin user hiện tại
  const { accessToken: userToken } = useSelector((state) => state.auth);

  const userInfoFromStorage = localStorage.getItem("userInfo");
  let userInfo = null;
  try {
    userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;
  } catch {
    userInfo = null;
  }

  const isUserLoggedIn = userToken && userInfo;

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoLogin = () => {
    navigate("/loginAdmin");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getErrorMessage = () => {
    if (isUserLoggedIn) {
      return `Tài khoản của bạn hiện đang đăng nhập với quyền "${
        userInfo.role || "user"
      }" 
              không được phép truy cập vào khu vực quản trị. 
              Chỉ có tài khoản với quyền "admin" mới có thể truy cập.`;
    }
    return `Bạn không có quyền truy cập vào trang này. 
            Vui lòng đăng nhập với tài khoản admin hoặc liên hệ quản trị viên để được cấp quyền.`;
  };

  return (
    <Container>
      <Card>
        <ErrorCode>403</ErrorCode>
        <ErrorTitle>Không có quyền truy cập</ErrorTitle>
        <ErrorMessage>{getErrorMessage()}</ErrorMessage>

        {isUserLoggedIn && (
          <UserInfo>
            <div className="user-detail">
              <strong>Thông tin tài khoản hiện tại:</strong>
            </div>
            <div className="user-detail">
              Email: {userInfo.email || userInfo.username || "Không xác định"}
            </div>
            <div className="user-detail">
              Quyền:{" "}
              <span className="user-role">{userInfo.role || "user"}</span>
            </div>
          </UserInfo>
        )}

        <ButtonGroup>
          <Button className="primary" onClick={handleGoLogin}>
            Đăng nhập Admin
          </Button>
          <Button className="secondary" onClick={handleGoHome}>
            Về trang chủ
          </Button>
          <Button className="secondary" onClick={handleGoBack}>
            Quay lại
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;
