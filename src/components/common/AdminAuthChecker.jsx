import { useSelector } from "react-redux";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a2038;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #333;
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: #9ca3af;
`;

const AdminAuthChecker = ({ children }) => {
  const { isLoading } = useSelector((state) => state.adminAuth);

  if (isLoading) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: "center" }}>
          <LoadingSpinner />
          <LoadingText>Đang kiểm tra quyền truy cập...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }

  return children;
};

export default AdminAuthChecker;
