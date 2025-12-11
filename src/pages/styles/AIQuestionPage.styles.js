// src/components/AIQuestionPage.styles.js
import styled, { createGlobalStyle } from "styled-components";
import bgImg from "../../assets/bgimg2.png";          // keep your own background image path
import clockIcon from "../../assets/clockicon.png";    // keep your own clock icon path
import sampleImage from "../../assets/100diemvang.png"; // optional placeholder image

/* -------------------------------------------------------------------------
   Global + Styled Components
-------------------------------------------------------------------------- */
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
  background-attachment: fixed;
  background-color: #f0f0e6;
  min-height: 100vh;
  width: 100%;
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
  display: block;
  font-size: 18px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const QuestionLabel = styled.strong`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 8px 14px;
  border-radius: 5px;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 14px;
  margin-right: 8px;
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
  cursor: pointer;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  color: ${({ textColor }) => textColor || "#000"};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  font-size: 16px;
  transition: all 0.3s ease;
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
      case "current": return "#007bff";
      case "done":    return "#28a745";
      default:        return "#6c757d";
    }
  }};
  border: 1px solid #ddd;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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

export const PlaceholderDiv = styled.div`
  width: 120px;
  height: 40px;
`;

export const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 18px;
  color: #333;

  .spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #007bff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ExamSubtitle = styled.div`
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  color: #555;
  margin-top: -8px;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 0.5px;
  opacity: 0.9;
  animation: fadeIn 0.6s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// =================== AI Pencil Loading Animation ===================

export const AILoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: hsl(223, 90%, 95%);
  color: hsl(223, 90%, 10%);
  font-family: 'Montserrat', sans-serif;
  gap: 24px;
`;

export const AILoadingText = styled.p`
  font-size: 20px;
  color: hsl(223, 90%, 20%);
  font-weight: 600;
  text-align: center;
  animation: fadeIn 1.2s ease-in-out infinite alternate;

  @keyframes fadeIn {
    from { opacity: 0.6; transform: translateY(3px); }
    to { opacity: 1; transform: translateY(-2px); }
  }
`;

export const PencilContainer = styled.div`
  width: 200px;
  height: 200px;

  .pencil {
    display: block;
    width: 10em;
    height: 10em;
  }

  .pencil__body1,
  .pencil__body2,
  .pencil__body3,
  .pencil__eraser,
  .pencil__eraser-skew,
  .pencil__point,
  .pencil__rotate,
  .pencil__stroke {
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .pencil__body1,
  .pencil__body2,
  .pencil__body3 {
    transform: rotate(-90deg);
  }

  .pencil__body1 { animation-name: pencilBody1; }
  .pencil__body2 { animation-name: pencilBody2; }
  .pencil__body3 { animation-name: pencilBody3; }
  .pencil__eraser { animation-name: pencilEraser; transform: rotate(-90deg) translate(49px,0); }
  .pencil__eraser-skew { animation-name: pencilEraserSkew; animation-timing-function: ease-in-out; }
  .pencil__point { animation-name: pencilPoint; transform: rotate(-90deg) translate(49px,-30px); }
  .pencil__rotate { animation-name: pencilRotate; }
  .pencil__stroke { animation-name: pencilStroke; transform: translate(100px,100px) rotate(-113deg); }

  /* Keyframes */
  @keyframes pencilBody1 {
    from, to { stroke-dashoffset: 351.86; transform: rotate(-90deg); }
    50% { stroke-dashoffset: 150.8; transform: rotate(-225deg); }
  }

  @keyframes pencilBody2 {
    from, to { stroke-dashoffset: 406.84; transform: rotate(-90deg); }
    50% { stroke-dashoffset: 174.36; transform: rotate(-225deg); }
  }

  @keyframes pencilBody3 {
    from, to { stroke-dashoffset: 296.88; transform: rotate(-90deg); }
    50% { stroke-dashoffset: 127.23; transform: rotate(-225deg); }
  }

  @keyframes pencilEraser {
    from, to { transform: rotate(-45deg) translate(49px,0); }
    50% { transform: rotate(0deg) translate(49px,0); }
  }

  @keyframes pencilEraserSkew {
    from, 32.5%, 67.5%, to { transform: skewX(0); }
    35%, 65% { transform: skewX(-4deg); }
    37.5%, 62.5% { transform: skewX(8deg); }
    40%, 45%, 50%, 55%, 60% { transform: skewX(-15deg); }
    42.5%, 47.5%, 52.5%, 57.5% { transform: skewX(15deg); }
  }

  @keyframes pencilPoint {
    from, to { transform: rotate(-90deg) translate(49px,-30px); }
    50% { transform: rotate(-225deg) translate(49px,-30px); }
  }

  @keyframes pencilRotate {
    from { transform: translate(100px,100px) rotate(0); }
    to { transform: translate(100px,100px) rotate(720deg); }
  }

  @keyframes pencilStroke {
    from { stroke-dashoffset: 439.82; transform: translate(100px,100px) rotate(-113deg); }
    50% { stroke-dashoffset: 164.93; transform: translate(100px,100px) rotate(-113deg); }
    75%, to { stroke-dashoffset: 439.82; transform: translate(100px,100px) rotate(112deg); }
  }
`;

export const ScoreModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  backdrop-filter: blur(4px);
`;

export const ScoreModalContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  color: white;
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const ScoreModalTitle = styled.h3`
  font-family: 'Impress', sans-serif;
  font-size: 28px;
  margin: 0 0 15px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const ScoreModalDescription = styled.p`
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  font-family: 'Montserrat-SemiBold', sans-serif;
`;

export const ScoreModalButton = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  font-family: 'Montserrat-SemiBold', sans-serif;
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }
`;

// Export any static assets if needed in styles (though typically imported in component)
export { clockIcon, sampleImage };