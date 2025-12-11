import styled, { createGlobalStyle } from 'styled-components';

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
    
  .fade-out {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

export const Sidebar = styled.aside`
  width: 280px;
  background-color: #f8f8f8;
  padding: 20px 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  margin-left: 20px;
`;

export const SearchBox = styled.div`
  margin-bottom: 15px;
  position: relative;
  padding: 0 5px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 38px 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #888;
  pointer-events: none;
`;

export const TopicItem = styled.div`
  position: relative;
  padding: 12px 12px 12px 30px;
  margin-bottom: 8px;
  background-color: ${props => props.active ? '#e6f2ff' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-weight: bold;
  border-left: 3px solid ${props => props.active ? '#4da3ff' : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f7ff;
  }

  &::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 18px;
    width: 12px;
    height: 12px;
    border: 2px solid ${props => props.active ? '#4da3ff' : '#bbb'};
    background-color: ${props => props.active ? '#4da3ff' : '#fff'};
    border-radius: 50%;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    left: 13px;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: #cdd4db;
    z-index: 0;
  }
`;

export const TopicTitle = styled.div`
  font-weight: bold;
  color: #333;
`;

export const ExamTitle = styled.div`
  font-weight: bold;
  color: #333;
`;

export const MainContent = styled.div`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  position: relative;
`;

export const CustomSelect = styled.div`
  position: relative;
  min-width: 180px;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 10px;
    height: 6px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3e%3cpath fill='black' d='M0 0l5 6 5-6z'/%3e%3c/svg%3e");
    background-size: cover;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
    pointer-events: none;
  }

  &.open::after {
    transform: translateY(-50%) rotate(180deg);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 28px 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  background-color: white;
  color: black;
  outline: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  appearance: none;
`;

export const MathSection = styled.section`
  background: linear-gradient(90deg, #f15a4f 0%, #f9a825 100%);
  padding: 20px;
  text-align: center;
  color: white;
  border-radius: 10px;
  
  ${props => props.isVisible && `
    animation: slideInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `}
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MathTitle = styled.h2`
  font-family: 'Impress', sans-serif;
  font-size: 32px;
  margin: 0 0 2px 0;
  
  ${props => props.isVisible && `
    animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
  `}
  
  @keyframes fadeInUp {
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

export const MathFiltersCustom = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0;
  
  > ${CustomSelect}:nth-child(1) {
    ${props => props.isVisible && `
      animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
    `}
  }
  
  > ${CustomSelect}:nth-child(2) {
    ${props => props.isVisible && `
      animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
    `}
  }
  
  @keyframes fadeInUp {
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

export const LessonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

export const LessonCard = styled.div`
  position: relative; /* ✅ để icon đặt theo góc card */
  background: ${props => props.active ? '#e6f2ff' : 'white'};
  border-radius: 10px;
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

export const LessonContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

export const LessonImageContainer = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const LessonImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const LessonTitle = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
`;

export const LessonIcons = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  color: #444;
`;

export const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const TheoryIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  transition: transform 0.2s ease;
  padding: 4px;

  &:hover {
    transform: scale(1.2);
    background-color: #f0f8ff;
  }
`;

export const IconLabel = styled.div`
  font-size: 16px;
  color: #444;
`;

export const ProgressContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transform: scale(0.85);
`;

export const ProgressCircle = styled.div`
  position: relative;
  width: 36px;
  height: 36px;

  svg {
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }

  .bg {
    stroke: #eee;
  }

  .progress {
    stroke: #007bff;
    transition: stroke-dashoffset 0.5s ease;
  }
`;

export const ProgressSvg = styled.svg`
  width: 32px;
  height: 32px;
`;

export const CircleBg = styled.circle`
  stroke: #eee;
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
`;

export const CircleProgress = styled.circle`
  stroke: #007bff;
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

export const ProgressPercentage = styled.div`
  position: absolute;
  top: 44%;
  left: 45%;
  transform: translate(-50%, -50%);
  font-size: 9px;
  color: #007bff;
  font-weight: bold;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 320px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

export const CompletionImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const CompletionModalButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

export const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
`;

export const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

export const BreadcrumbPart = styled.span`
  color: #333;
  font-weight: 500;
`;

export const BreadcrumbSeparator = styled.span`
  color: #999;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 130px;
  right: 20px;
  z-index: 999;
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

export const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TimerBox = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => (props.isDanger ? "crimson" : "#007bff")};
  background-color: #fff;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-bottom: 16px
`;

export const QuestionContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 4px 16px 16px 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  max-width: 840px;
  margin-left: auto;
  margin-right: auto;
`;

export const TextPassageContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  white-space: pre-wrap; // Giữ định dạng văn bản
`;

export const QuestionText = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 1.6;
`;

export const QuestionNumber = styled.strong`
  font-weight: bold;
  color: #007bff;
`;

export const QuestionImage = styled.img`
  width: 400px;
  object-fit: contain;
  margin-top: 20px;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const OptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const OptionListItem = styled.li`
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${props => props.bgColor || '#fff'};
  color: ${props => props.textColor || '#000'};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  font-size: 16px;
  transition: all 0.3s ease;
  min-height: 20px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

export const AnswerInputContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

export const AnswerInput = styled.input`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 18px;
  border: 3px solid ${props => props.isAnswered ? (props.isCorrect ? 'green' : 'red') : '#e9ecef'};
  border-radius: 10px;
  font-size: 18px;
  margin-top: 15px;
  background-color: ${props => props.isAnswered ? (props.isCorrect ? '#d4edda' : '#f8d7da') : '#fff'};
  transition: all 0.3s ease;
  box-sizing: border-box;
  
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

export const AnswerFeedback = styled.div`
  margin-top: 15px;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.isCorrect ? 'green' : 'red'};
  background-color: ${props => props.isCorrect ? '#d4edda' : '#f8d7da'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AnswerExplanation = styled.div`
  margin-top: 15px;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: #e8f4ff;
  border-left: 5px solid #007bff;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  font-family: 'Montserrat-SemiBold', sans-serif;
`;

export const NavigationButtons = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;   /* ✅ căn giữa các nút */
  gap: 20px;                 /* ✅ cách nhau 20px */
  flex-wrap: wrap;
  width: 100%;
`;

export const NavigationButton = styled.button`
  background: ${props => props.bgColor};
  color: ${props => props.textColor || '#fff'};
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  /* ✅ bỏ full width – nút sẽ nằm ngang */
  min-width: 150px;
  width: auto;
  margin: 0;

  ${props => props.bgColor === '#ffc107' && !props.hasSelection && `
    opacity: 0.8;
    border: 2px dashed #e0a800;
    &:hover {
      opacity: 1;
      background: #e0a800;
      border-style: solid;
      transform: translateY(-2px);
    }
  `}

  ${props => props.bgColor === '#ffc107' && props.hasSelection && `
    opacity: 1;
    border: 2px solid #e0a800;
    &:hover {
      background: #e0a800;
      transform: translateY(-2px);
    }
  `}

  ${props => props.bgColor === 'green' && `
    border: 2px solid #28a745;
    &:hover {
      background: #218838;
    }
  `}

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;


export const NavigationPlaceholder = styled.div`
  height: 44px;
`;

export const LevelModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11000;
`;

export const LevelModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
  position: relative;
`;

export const LevelButtons = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const LevelButton = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  width: 100px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.bgColor || '#007bff'};
  color: ${props => props.disabled ? '#cccccc' : '#fff'};
  border: none;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: ${props => props.bgColor === 'red' ? '#c82333' : '#0056b3'};
  }
`;

export const VideoContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-top: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

export const CommentContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

export const CommentForm = styled.form`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
`;

export const CommentInput = styled.input`
  flex: 1;
  padding: 15px 18px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  font-family: 'Montserrat-SemiBold', sans-serif;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const CommentSubmitButton = styled.button`
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  transition: all 0.3s ease;
  min-width: 100px;
  
  &:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CommentItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin: 0 -20px;
  }
`;

export const CommentAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e9ecef;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const CommentUsername = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  font-family: 'Montserrat-SemiBold', sans-serif;
`;

export const CommentTimestamp = styled.div`
  font-size: 13px;
  color: #666;
  font-family: 'Montserrat-SemiBold', sans-serif;
`;

export const CommentText = styled.div`
  font-size: 16px;
  color: #333;
  font-family: 'Montserrat-SemiBold', sans-serif;
  line-height: 1.6;
  margin-left: 2px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000;
  }
`;

export const QuestionLayoutWrapper = styled.div`
  display: flex;
  gap: 25px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
`;

export const QuestionSquaresColumn = styled.div`
  min-width: 200px;
  padding: 15px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  height: fit-content;
`;

export const QuestionLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;
`;

export const QuestionSidebar = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 90px;
  height: fit-content;
`;

export const QuestionSquaresContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  gap: 10px;
`;

export const SubmitButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

export const QuestionSquare = styled.div`
  position: relative; /* ✅ cần để đặt cờ */
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isActive ? '#007bff' :
    props.isSkipped ? '#f8d7da' :
    props.isAnswered ? '#d4edda' : '#e9ecef'};
  color: ${props =>
    props.isActive ? '#fff' :
    props.isSkipped ? 'red' :
    props.isAnswered ? 'green' : '#333'};
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  /* ✅ Cờ nhỏ ở góc phải trên */
  &::after {
    content: "${props => (props.isFlagged ? '🚩' : '')}";
    position: absolute;
    top: -14px;
    right: 14px;
    font-size: 18px;
  }
`;

export const ResultImage = styled.img`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 200px;
  z-index: 1200;
  animation: bounceInOut 2s ease-in-out;
  pointer-events: none;

  @keyframes bounceInOut {
    0% { 
      opacity: 0; 
      transform: translate(-50%, -50%) scale(0.3) rotate(-10deg); 
    }
    20% { 
      opacity: 1; 
      transform: translate(-50%, -50%) scale(1.1) rotate(5deg); 
    }
    40%, 60% { 
      opacity: 1; 
      transform: translate(-50%, -50%) scale(1) rotate(0deg); 
    }
    80% { 
      transform: translate(-50%, -50%) scale(1.05); 
    }
    100% { 
      opacity: 0; 
      transform: translate(-50%, -50%) scale(0.8) rotate(10deg); 
    }
  }
`;

export const AnswerSelectionModalOverlay = styled.div`
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

export const AnswerSelectionModalContent = styled.div`
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

export const AnswerSelectionModalIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.9;
`;

export const AnswerSelectionModalTitle = styled.h3`
  font-family: 'Impress', sans-serif;
  font-size: 28px;
  margin: 0 0 15px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const AnswerSelectionModalDescription = styled.p`
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  font-family: 'Montserrat-SemiBold', sans-serif;
`;

export const AnswerSelectionModalButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

export const AnswerSelectionModalButton = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  font-family: 'Montserrat-SemiBold', sans-serif;

  &:first-child {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);

    &:hover:not(:disabled) {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const StarRatingContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const StarIcon = styled.div`
  font-size: 20px;
  color: ${props => props.isActive ? '#ffc107' : '#e9ecef'};
  cursor: ${props => props.isActive ? 'pointer' : 'pointer'};
  transition: color 0.2s ease;

  &:hover {
    color: #ffc107;
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

// 🔹 Hiệu ứng loading AI cho modal
export const AILoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  justify-content: center;
  min-height: 200px;
`;

export const AILoadingSpinner = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spinPulse 1.2s ease-in-out infinite;

  &::before {
    content: "🤖";
    font-size: 32px;
    position: absolute;
    color: white;
    opacity: 0.9;
    animation: pulseGlow 1.2s ease-in-out infinite;
  }

  @keyframes spinPulse {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }

  @keyframes pulseGlow {
    0%, 100% { transform: scale(0.9); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }
`;

export const AILoadingTitle = styled.h3`
  font-family: 'Impress', sans-serif;
  font-size: 26px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  margin: 10px 0 5px 0;
  animation: fadeInText 1s ease-in-out infinite alternate;

  @keyframes fadeInText {
    from { opacity: 0.6; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(-2px); }
  }
`;

export const AILoadingSubtitle = styled.p`
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  font-family: 'Montserrat-SemiBold', sans-serif;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
`;

export const NutsTooltip = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateY(5px);
  transition: all 0.25s ease;
  z-index: 10;

  /* Mũi tên nhỏ dưới tooltip */
  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    right: 12px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

export const NutsWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  cursor: pointer;

  /* Hiển thị tooltip khi hover */
  &:hover ${NutsTooltip} {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const NutsText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #f39c12; /* màu vàng cam cho nổi bật */
  margin-right: 5px;
`;

export const NutsIcon = styled.img`
  width: 26px;
  height: 26px;
  object-fit: contain;
`;
