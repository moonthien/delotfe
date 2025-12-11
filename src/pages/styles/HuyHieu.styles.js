import styled, { keyframes } from "styled-components";
import bgImage from "../../assets/bg_2.jpg";

/* ========== LAYOUT CHÍNH ========== */
export const PageWrapper = styled.main`
  padding: 20px;
  font-family: "Montserrat-SemiBold", sans-serif;
`;

export const PageTitle = styled.h1`
  font-family: "Impress", sans-serif;
  font-size: 32px;
  margin-bottom: 20px;
  color: #2e2e2e;
  text-align: center;
`;

export const TabMenu = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 0;

  button {
    padding: 10px 20px;
    border-radius: 10px 10px 0 0;
    border: none;
    background: #95a5b5;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: #f36a46;
    }
  }
`;

/* ========== GRID HIỂN THỊ ========== */
export const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 24px;
  border-radius: 16px;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: visible; /* ✅ cho tooltip hiển thị ra ngoài */

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.83);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

/* ========== THANH TIẾN ĐỘ ========== */
export const ProgressBarContainer = styled.div`
  margin-top: 8px;
  position: relative;
  background: #e0e0e0;
  border-radius: 8px;
  height: 10px;
  width: 100%;
  overflow: hidden;

  span {
    font-size: 11px;
    color: #555;
    display: block;
    margin-top: 4px;
  }
`;

const growAnimation = (width) => keyframes`
  from { width: 0%; }
  to { width: ${width}%; }
`;

export const ProgressBar = styled.div.attrs((props) => ({
  style: {
    width: `${props["data-percent"] || 0}%`,
  },
}))`
  height: 100%;
  background: linear-gradient(90deg, #f36a46, #ffb347);
  border-radius: 8px;
  animation: ${(props) =>
      growAnimation(props["data-percent"] || 0)} 1.2s ease-out;
`;

/* ========== HIỆU ỨNG ========== */
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px 4px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 0 22px 10px rgba(255, 215, 0, 1); }
`;

const firework = keyframes`
  0% { transform: scale(0.2) rotate(45deg); opacity: 0.8; }
  50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
  100% { transform: scale(0.2) rotate(45deg); opacity: 0; }
`;

export const FireworkEffect = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    ),
    url("https://i.gifer.com/origin/7d/7d3c22b6d8b6df7a74acfd0907b2b7fa.gif");
  background-size: cover;
  animation: ${firework} 1.2s ease-out infinite;
  border-radius: 12px;
  opacity: 0.8;

  ${({ big }) =>
    big &&
    `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(255,255,255,0.05);
  `}
`;

/* ========== TOOLTIP MỚI (absolute toàn grid) ========== */
export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 46, 46, 0.95);
  color: #fff;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  opacity: 0;
  animation: fadeIn 0.25s ease forwards;
  z-index: 999;
  pointer-events: none;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(46, 46, 46, 0.95);
  }
`;

/* ========== HUY HIỆU ========== */
export const BadgeCard = styled.div`
  width: 160px;
  background: ${(props) => (props.unlocked ? "#fff" : "#f7f7f7")};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: ${(props) =>
    props.unlocked
      ? "0 4px 12px rgba(0,0,0,0.2)"
      : "0 2px 6px rgba(0,0,0,0.1)"};
  transition: all 0.3s ease;
  position: relative;
  overflow: visible; /* ✅ quan trọng để tooltip nổi lên */

  ${({ newUnlocked }) =>
    newUnlocked &&
    `
    animation: ${glow} 1.5s ease-in-out 3;
    border: 2px solid gold;
  `}

  &:hover {
    transform: ${(props) => (props.unlocked ? "translateY(-6px)" : "none")};
  }

  > img:not(.nuts-icon) {
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 15px;
    margin-bottom: 4px;
    color: #333;
  }

  p {
    font-size: 13px;
    color: #555;
  }
`;

export const NutsReward = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  font-size: 11.5px;
  font-weight: 600;
  color: #f39c12;
  z-index: 5;
  opacity: 0.8;
  transform: scale(0.95);
  transition: all 0.25s ease; /* ✅ thêm hiệu ứng mượt */

  /* 🔥 Khi hover card, hiệu ứng fade + sáng nhẹ */
  ${BadgeCard}:hover & {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(255, 193, 7, 0.5);
    background: rgba(255, 255, 255, 1);
  }
`;

export const NutsRewardIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  margin-left: 3px;
`;