import styled, { createGlobalStyle, keyframes } from "styled-components";
import heroBg from "../../assets/background.png";
import cloudsBg from "../../assets/v677-ken-29-animalbadge.jpg";
import whyChooseBg from "../../assets/whychoose-bg.png";

// Thêm animation lên xuống
const floatUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;

// Animated gradient background
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Subtle glow animation
const subtleGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(76, 175, 80, 0.2);
  }
`;

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/Nunito-Medium.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

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
    font-family: 'Open Sans', sans-serif;

    /* Ẩn thanh cuộn nhưng vẫn cho phép cuộn */
    -ms-overflow-style: none;  /* IE & Edge */
    scrollbar-width: none;     /* Firefox */
  }

  /* Chrome, Safari */
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const HeroSection = styled.section`
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  align-items: center;
  justify-content: flex-start;
  min-height: 500px;
  color: #333;
  position: relative;
  width: 100%;
  font-family: "Nunito", sans-serif;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    z-index: 1;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    background-attachment: scroll;
    min-height: 450px;
  }
`;

export const HeroText = styled.div`
  max-width: 650px;
  padding: 54px 32px;
  border-radius: 16px;

  h1 {
    font-family: "Nunito", sans-serif;
    font-size: 56px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 24px;
    white-space: pre-wrap;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  p {
    font-family: "Open Sans", sans-serif;
    font-size: 20px;
    font-weight: 500;
    color: #2d3748;
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 520px;
  }

  @media (max-width: 768px) {
    padding: 32px 20px;

    h1 {
      font-size: 42px;
    }

    p {
      font-size: 18px;
    }
  }
`;

export const CTAButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 16px 36px;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: ${subtleGlow} 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 16px;
  }
`;

const fadeInChar = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const TitleChar = styled.span`
  display: inline-block;
  opacity: 0;
  animation: ${fadeInChar} 0.04s forwards;
`;

// Styled Dot Indicators
export const DotIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  padding: 16px;
`;

export const DotIndicator = styled.button`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #29b6f6 0%, #1e88e5 100%)"
      : "rgba(255, 255, 255, 0.6)"};

  box-shadow: ${(props) =>
    props.$active
      ? "0 4px 12px rgba(41, 182, 246, 0.4)"
      : "0 2px 6px rgba(0, 0, 0, 0.15)"};

  transform: ${(props) => (props.$active ? "scale(1.2)" : "scale(1)")};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)"
        : "rgba(255, 255, 255, 0.8)"};
    transform: scale(1.1);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    transform: translate(-50%, -50%)
      scale(${(props) => (props.$active ? "1" : "0")});
    transition: transform 0.3s ease;
  }
`;

export const HeroIcons = styled.div`
  position: absolute;
  top: 50%;
  right: 270px;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(2, 88px);
  grid-auto-rows: 88px;
  gap: 14px;
  z-index: 1;

  @media (max-width: 992px) {
    right: 16px;
    grid-template-columns: repeat(2, 72px);
    grid-auto-rows: 72px;
    gap: 12px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const IconBubble = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatUpDown} 2.8s ease-in-out infinite;
  will-change: transform;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  img {
    max-width: 48px;
    max-height: 48px;
    width: auto;
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  /* Sắp xếp lộn xộn nhẹ nhàng + nhịp khác nhau */
  &:nth-child(1) {
    margin-top: -8px;
    margin-left: -6px;
    animation-duration: 2.6s;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    margin-top: -2px;
    margin-left: 10px;
    animation-duration: 3s;
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    margin-top: 6px;
    margin-left: -12px;
    animation-duration: 2.4s;
    animation-delay: 0.4s;
  }
  &:nth-child(4) {
    margin-top: 14px;
    margin-left: 8px;
    animation-duration: 3.2s;
    animation-delay: 0.6s;
  }

  @media (max-width: 992px) {
    width: 72px;
    height: 72px;
    img {
      max-width: 40px;
      max-height: 40px;
    }
    &:nth-child(1) {
      margin-top: -6px;
      margin-left: -4px;
    }
    &:nth-child(2) {
      margin-top: -2px;
      margin-left: 8px;
    }
    &:nth-child(3) {
      margin-top: 4px;
      margin-left: -8px;
    }
    &:nth-child(4) {
      margin-top: 10px;
      margin-left: 6px;
    }
  }
`;

export const StatsSection = styled.section`
  background-image: url(${cloudsBg});
  background-size: cover;
  background-position: center;
  padding: 60px 20px;
  text-align: center;
`;

export const StatsTitle = styled.h2`
  font-family: "Nunito", sans-serif;
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 50px;
  color: #1a1a1a;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 40px;
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
`;

export const StatItem = styled.div`
  max-width: 280px;
  text-align: center;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 50%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  img {
    max-width: 60px;
    max-height: 60px;
    width: auto;
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  }

  h3 {
    font-family: "Nunito", sans-serif;
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    color: #1a1a1a;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  p {
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 16px;
    max-width: 260px;

    h3 {
      font-size: 28px;
    }

    p {
      font-size: 15px;
    }
  }
`;

export const RankingSection = styled.section`
  background: linear-gradient(135deg, #4db8ff 0%, #0080ff 50%, #0066cc 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 8s ease infinite;
  padding: 60px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    padding: 40px 15px;
  }
`;

export const RankingTitle = styled.h2`
  font-family: "Nunito", sans-serif;
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 30px;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 25px;
  }
`;

export const RankingFiltersCustom = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;

  .custom-select {
    position: relative;
    min-width: 180px;
  }

  select {
    width: 100%;
    padding: 12px 36px 12px 16px;
    border-radius: 16px;
    border: none;
    font-family: "Open Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.95);
    color: #1a1a1a;
    outline: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: white;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
  }

  .custom-select::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%) rotate(0deg);
    width: 12px;
    height: 8px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='%23333' d='M0 0l6 8 6-8z'/%3e%3c/svg%3e");
    background-size: cover;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
    pointer-events: none;
  }

  .custom-select.open::after {
    transform: translateY(-50%) rotate(180deg);
  }

  @media (max-width: 768px) {
    gap: 12px;

    .custom-select {
      min-width: 160px;
    }

    select {
      padding: 10px 32px 10px 14px;
      font-size: 13px;
    }
  }
`;

export const RankingPodium = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* đổi từ flex-end thành flex-start */
  gap: 40px;
`;

export const PodiumItem = styled.div`
  text-align: center;
  transition: transform 0.8s ease, opacity 0.8s ease;

  /* Animation di chuyển lên xuống */
  &.rank1,
  &.rank2,
  &.rank3 {
    animation: ${floatUpDown} 2s ease-in-out infinite;
  }

  img.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-bottom: 12px;
    border: 4px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  > div {
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 8px;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  > small {
    display: block;
    font-family: "Open Sans", sans-serif;
    font-weight: 500;
    font-size: 13px;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .platform {
    margin-top: 8px;
    img {
      width: 110px;
      height: auto;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
  }

  &:first-child {
    margin-top: 40px;
  }
  &:last-child {
    margin-top: 60px;
  }
  &:nth-child(2) {
    margin-top: 0;
  }

  &:hover img.avatar {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    img.avatar {
      width: 70px;
      height: 70px;
    }

    > div {
      font-size: 16px;
    }

    > small {
      font-size: 12px;
    }

    .platform img {
      width: 90px;
    }
  }
`;

export const RankingList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 550px;
  margin: 0 auto;

  li {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 12px 16px;
    margin-bottom: 12px;
    gap: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }

  .rank-number {
    font-family: "Nunito", sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: #4a5568;
    width: 36px;
    text-align: center;
    flex-shrink: 0;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
  }

  .student-name {
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #1a1a1a;
    line-height: 1.3;
    margin-bottom: 2px;
  }

  .school-name {
    font-family: "Open Sans", sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: #718096;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 10px;

    li {
      padding: 10px 14px;
      gap: 12px;
    }

    .rank-number {
      font-size: 16px;
      width: 32px;
    }

    .avatar {
      width: 38px;
      height: 38px;
    }

    .student-name {
      font-size: 15px;
    }

    .school-name {
      font-size: 12px;
    }
  }
`;

export const WhyChooseSection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background-color: #fff;
  background-image: url(${whyChooseBg});
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;

  h2 {
    font-family: "Nunito", sans-serif;
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 32px;
    color: #1a1a1a;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.5px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0);
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;

    h2 {
      font-size: 32px;
      margin-bottom: 28px;
    }
  }
`;

export const WhyChooseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  padding: 0 20px;

  @media (max-width: 992px) {
    gap: 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

export const TabMenu = styled.div`
  display: inline-flex;
  border-radius: 16px;
  background-color: #f7fafc;
  padding: 6px;
  margin-bottom: 50px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  button {
    border: none;
    padding: 14px 28px;
    border-radius: 16px;
    background: none;
    font-family: "Nunito", sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #4a5568;
    white-space: nowrap;

    &.active {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      transform: translateY(-1px);
    }

    &:hover:not(.active) {
      background-color: rgba(76, 175, 80, 0.1);
      color: #2d3748;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;

    button {
      padding: 12px 20px;
      margin-bottom: 2px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

export const WhyChooseContent = styled.div`
  flex: 1 1 500px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 35px 25px;

  .item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    text-align: left;
    padding: 20px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      margin-top: 2px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    div {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    h3 {
      font-family: "Nunito", sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1a1a1a;
      line-height: 1.3;
    }

    p {
      font-family: "Open Sans", sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #4a5568;
      line-height: 1.5;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 20px;

    .item {
      padding: 16px;

      img {
        width: 40px;
        height: 40px;
      }

      h3 {
        font-size: 17px;
      }

      p {
        font-size: 13px;
      }
    }
  }
`;

export const WhyChooseImage = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 180px;
    height: auto;
  }
`;

export const BalloonImage = styled.img`
  position: absolute;
  top: 360px;
  right: 40px;
  width: 300px;
  height: auto;
  animation: ${floatUpDown} 4s ease-in-out infinite;
  opacity: 0.9;
  pointer-events: none; /* không chặn click */

  @media (max-width: 768px) {
    display: none; /* ẩn trên mobile nếu chật màn hình */
  }
`;

export const BalloonImageLeft = styled.img`
  position: absolute;
  top: 60px;
  left: 40px;
  width: 190px;
  height: auto;
  animation: ${floatUpDown} 4.2s ease-in-out infinite;
  opacity: 0.9;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const BalloonImageBottom = styled.img`
  position: absolute;
  top: 700px;
  left: 140px;
  width: 180px;
  height: auto;
  animation: ${floatUpDown} 4.2s ease-in-out infinite;
  opacity: 0.9;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;
