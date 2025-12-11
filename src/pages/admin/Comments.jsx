import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 24px auto;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  .icon {
    font-size: 32px;
  }

  .text {
    background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 50%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 44px;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 100%);
    border-radius: 2px;
    opacity: 0.7;
  }
`;

const Comments = () => {
  return (
    <Container>
      <PageTitle>
        <span className="icon">💬</span>
        <span className="text">Quản lý Bình luận</span>
      </PageTitle>
    </Container>
  );
};

export default Comments;
