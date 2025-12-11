import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ===== Global Styles =====
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

// ===== Animations =====
export const floatLeftToRight = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(50px); }
  100% { transform: translateX(0); }
`;

export const floatRightToLeft = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(-50px); }
  100% { transform: translateX(0); }
`;

export const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ===== Styled Components =====
export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url('/backgroundlogin.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
`;

export const FullscreenContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 2;
  padding: 20px;
`;

export const RegisterContainer = styled.div`
  width: 450px;
  max-width: 90vw;
  padding: 48px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  color: #fff;

  @media (max-width: 1024px) {
    padding: 32px;
  }

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

export const Logo = styled.img`
  display: block;
  margin: 0 auto 20px;
  max-width: 150px;

  @media (max-width: 1024px) {
    max-width: 120px;
  }

  @media (max-width: 600px) {
    max-width: 100px;
  }
`;

export const Cloud = styled.img`
  position: absolute;
  top: 8%;
  left: calc(50% - 294px);
  width: 6vw;
  max-width: 100px;
  z-index: 2;
  animation: ${floatLeftToRight} 6s ease-in-out infinite;

  @media (max-width: 1024px) {
    width: 90px;
    top: 18%;
    left: 12%;
  }

  @media (max-width: 600px) {
    width: 64px;
    top: 17%;
    left: -10%;
  }
`;

export const Cloud2 = styled.img`
  position: absolute;
  top: 8%;
  right: calc(50% - 294px);
  width: 6vw;
  max-width: 100px;
  z-index: 2;
  animation: ${floatRightToLeft} 6s ease-in-out infinite;

  @media (max-width: 1024px) {
    width: 90px;
    top: 18%;
    right: 12%;
  }

  @media (max-width: 600px) {
    width: 64px;
    top: 17%;
    right: -10%;
  }
`;

export const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const EmailRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 40px 14px 12px;
  font-size: 16px;
  border: 2px solid ${({ $invalid }) => ($invalid ? 'red' : '#ccc')};
  border-radius: 999px;
  background-color: white;
  color: black;
  outline: none;

  &:focus {
    border-color: ${({ $invalid }) => ($invalid ? 'red' : '#4caf50')};
  }
`;

export const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 16px;
  color: ${({ $invalid }) => ($invalid ? 'red' : '#999')};
  background-color: white;
  border-radius: 999px;
  padding: 0 14px;
  transition: all 0.2s ease;
  pointer-events: none;

  &.active {
    top: -8px;
    left: 26px;
    font-size: 14px;
    color: ${({ $invalid }) => ($invalid ? 'red' : '#4caf50')};
    transform: none;
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  right: 20px;
  top: 55%;
  transform: translateY(-50%);
  cursor: pointer;

  svg {
    stroke: #999;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  font-size: 18px;
  margin-bottom: 8px;

  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(76, 175, 80, 0.45);
    box-shadow: 0 12px 48px rgba(76, 175, 80, 0.6);
  }
`;

export const LoginLink = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: white;

  a {
    color: #66f56dff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  color: black;
  text-align: center;
`;

export const ModalButton = styled.button`
  margin-top: 16px;
  padding: 8px 20px;
  border: none;
  border-radius: 999px;
  background-color: #4caf50;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

export const CodeInputRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 16px;
  justify-content: center;
`;

export const CodeInput = styled.input.attrs({
  type: 'text',
  inputMode: 'numeric',
})`
  width: 40px;
  height: 48px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #4caf50;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 13px;
  margin-top: 6px;
  padding-left: 12px;
  animation: ${fadeSlideUp} 0.3s ease forwards;
`;
