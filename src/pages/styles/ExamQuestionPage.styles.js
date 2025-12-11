import styled, { createGlobalStyle } from "styled-components";
import bgImg from "../../assets/bgimg2.png";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Impress';
    src: url('/fonts/SVN-Impress.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'SmoochSans-Medium';
    src: url('/fonts/SmoochSans-Medium.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const PageContainer = styled.div`
  padding: 48px;
  background-image: url(${bgImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* Stabilize background image */
  background-color: #f0f0e6;
  min-height: 100vh; /* Ensure consistent height */
  width: 100%; /* Ensure consistent width */
  box-sizing: border-box;
`;

export const ExamTitle = styled.h2`
  margin-bottom: 12px;
  font-family: "Impress", sans-serif;
  text-align: center;
  font-size: 28px;
`;

export const QuestionCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-top: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-width: 800px;
  min-width: 400px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Montserrat-SemiBold", sans-serif;
  position: relative;
`;

export const QuestionText = styled.p`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  line-height: 1.6;
`;

export const QuestionLabel = styled.strong`
  display: inline-flex;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 10px 14px;
  border-radius: 5px;
  position: relative;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 18px;
  font-weight: bold;

  &:after {
    content: "";
    position: absolute;
    right: -12px;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-left: 12px solid #007bff;
  }
`;

export const ImageContainer = styled.div`
  margin: 12px 0;
  text-align: center;
`;

export const QuestionImage = styled.img`
  width: 360px;
  height: 240px;
  object-fit: contain;
`;

export const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const OptionItem = styled.li`
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  color: ${({ textColor }) => textColor || "#000"};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  font-size: 16px;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const InputAnswer = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 15px;
  background-color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

export const NavigationContainer = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
`;

export const ActionButton = styled.button`
  background: ${({ bgColor }) => bgColor || "#007bff"};
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ zIndex }) => zIndex || 1000};
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  text-align: center;
  min-width: 360px;
`;

export const ModalTitle = styled.h2`
  margin-bottom: 12px;
  font-size: 24px;
`;

export const ModalText = styled.p`
  font-size: 20px;
  margin-top: 12px;
`;

export const ModalButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
`;

export const ReviewText = styled.p`
  font-size: 18px;
`;

export const ScoreText = styled.p`
  font-size: 18px;
`;

export const TimeText = styled.p`
  font-size: 18px;
`;

export const InputContainer = styled.div`
  width: 100%;
`;

export const PlaceholderDiv = styled.div`
  width: 120px;
  height: 40px;
`;

export const QuestionIndicators = styled.div`
  display: flex;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 6px;
  font-family: "Montserrat-SemiBold", sans-serif;
  justify-content: center;
`;

export const QuestionIndicator = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case "current":
        return "#007bff"; // Blue for current question
      case "done":
        return "#28a745"; // Green for answered
      default:
        return "#6c757d"; // Gray for pending
    }
  }};
  border: 1px solid #ddd;
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    ${({ clickable }) => (clickable ? `
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10;
    ` : '')}
  }

  &:active {
    ${({ clickable }) => (clickable ? `
      transform: scale(0.95);
    ` : '')}
  }
`;

export const WarningModalText = styled.p`
  font-size: 18px;
  margin: 12px 0;
  color: #dc3545;
`;

export const QuestionProgress = styled.div`
  position: absolute;
  width: 10%;
  top: 64px;
  right: 205px;
  background: #007bff;
  color: white;
  padding: 8px 16px;
  font-family: "Montserrat-SemiBold", sans-serif;
  border-radius: 0px 8px 0px 0px;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const QuestionProgressClock = styled.div`
  position: absolute;
  width: 10%;
  top: 109px;
  right: 205px;
  background: #ffffff;
  color: black;
  border-radius: 0px 0px 8px 0px;
  padding: 8px 16px;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .clock-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;