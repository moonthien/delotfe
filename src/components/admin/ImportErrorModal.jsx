import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-left: 6px solid #ef4444;
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #fee2e2;
`;

const ErrorTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ErrorMessage = styled.div`
  font-size: 16px;
  color: #374151;
  margin-bottom: 20px;
  line-height: 1.6;
  font-weight: 500;
`;

const ErrorDetailsList = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ErrorDetailsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ErrorDetailItem = styled.div`
  font-size: 14px;
  color: #991b1b;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: "•";
    position: absolute;
    left: 8px;
    top: 0;
    color: #dc2626;
    font-weight: bold;
    font-size: 16px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const ActionButton = styled.button`
  background: ${(props) =>
    props.variant === "primary" ? "#dc2626" : "#6b7280"};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#b91c1c" : "#4b5563"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-style: italic;
`;

const ImportErrorModal = ({ isOpen, onClose, errorData = {} }) => {
  if (!isOpen) return null;

  const {
    title = "Lỗi Import File Excel",
    message = "Đã xảy ra lỗi khi import file Excel",
    details = [],
    errors = [],
  } = errorData;

  // Combine details and errors arrays
  const allErrors = [...(details || []), ...(errors || [])];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ErrorHeader>
          <ErrorTitleSection>
            <ErrorTitle>
              <span>❌</span>
              {title}
            </ErrorTitle>
          </ErrorTitleSection>
          <CloseButton onClick={onClose} title="Đóng">
            ✕
          </CloseButton>
        </ErrorHeader>

        <ErrorMessage>{message}</ErrorMessage>

        {allErrors.length > 0 && (
          <ErrorDetailsList>
            <ErrorDetailsTitle>
              <span>⚠️</span>
              Chi tiết lỗi:
            </ErrorDetailsTitle>
            {allErrors.map((error, index) => (
              <ErrorDetailItem key={index}>
                {typeof error === "string"
                  ? error
                  : error.message || "Lỗi không xác định"}
              </ErrorDetailItem>
            ))}
          </ErrorDetailsList>
        )}

        <ModalFooter>
          <ActionButton onClick={onClose}>Đóng</ActionButton>
          <ActionButton variant="primary" onClick={onClose}>
            Thử lại
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImportErrorModal;
