import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  width: 360px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.2s ease;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Button = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  background-color: ${(props) => props.$bg || "#999"};
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <Overlay>
      <ModalBox>
        <Title>{message}</Title>
        <ButtonRow>
          <Button $bg="#28a745" onClick={onConfirm}>
            Đồng ý
          </Button>
          <Button $bg="#dc3545" onClick={onCancel}>
            Hủy
          </Button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
};

export default ConfirmModal;
