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
const floatLeftToRight = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(50px); }
  100% { transform: translateX(0); }
`;

const floatRightToLeft = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(-50px); }
  100% { transform: translateX(0); }
`;

const shimmerAngle = keyframes`
  0% { --angle-1: -75deg; --angle-2: -45deg; }
  100% { --angle-1: -125deg; --angle-2: -75deg; }
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

export const LoginContainer = styled.div`
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
  top: 14%;
  left: calc(50% - 290px);
  width: 6vw;
  max-width: 100px;
  z-index: 2;
  animation: ${floatLeftToRight} 6s ease-in-out infinite;

  @media (max-width: 1024px) {
    width: 90px;
    top: 26%;
    left: 13%;
  }

  @media (max-width: 600px) {
    width: 64px;
    top: 24%;
    left: -10%;
  }
`;

export const Cloud2 = styled.img`
  position: absolute;
  top: 14%;
  right: calc(50% - 290px);
  width: 6vw;
  max-width: 100px;
  z-index: 2;
  animation: ${floatRightToLeft} 6s ease-in-out infinite;

  @media (max-width: 1024px) {
    width: 90px;
    top: 26%;
    right: 13%;
  }

  @media (max-width: 600px) {
    width: 64px;
    top: 24%;
    right: -10%;
  }
`;

export const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-top: 24px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 40px 14px 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 999px;
  background-color: white;
  color: black;
  outline: none;

  &:focus {
    border-color: #4caf50;
  }

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
  background-color: white;
  border-radius: 999px;
  padding: 0 14px;
  transition: all 0.2s ease;
  pointer-events: none;

  &.active {
    top: -8px;
    left: 26px;
    font-size: 14px;
    color: #4caf50;
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

  @media (max-width: 1024px) {
    font-size: 17px;
  }

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 24px;

  a {
    color: #418143ff;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }

    @media (max-width: 1024px) {
      font-size: 15px;
    }

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
`;

export const RegisterLink = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: white;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }

  a {
    color: #66f56dff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const HomeCircle = styled.div`
  --border-width: 2px;
  --angle-1: -75deg;
  --angle-2: -45deg;

  margin: 24px auto 0;
  height: 48px;
  width: 48px;
  border-radius: 999px;
  background: linear-gradient(
    -75deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  );
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.05),
              inset 0 -1px 1px rgba(255,255,255,0.5),
              0 2px 1px -1px rgba(0,0,0,0.2),
              0 0 0.1em 0.25em inset rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  animation: ${shimmerAngle} 3s ease-in-out infinite alternate;

  &:hover {
    width: 136px;
    padding-left: 16px;
    transform: scale(0.975);
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.05),
                inset 0 -1px 1px rgba(255,255,255,0.5),
                0 3px 1px -1px rgba(0,0,0,0.25),
                0 0 0.05em 0.1em inset rgba(255,255,255,0.5);
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: 999vw;
    width: calc(100% + var(--border-width));
    height: calc(100% + var(--border-width));
    top: calc(0% - var(--border-width) / 2);
    left: calc(0% - var(--border-width) / 2);
    padding: var(--border-width);
    box-sizing: border-box;
    background: conic-gradient(
        from var(--angle-1) at 50% 50%,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0) 5% 40%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0) 60% 95%,
        rgba(0, 0, 0, 0.5)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all 0.4s ease;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    pointer-events: none;
  }

  svg {
    stroke: black;
    flex-shrink: 0;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .home-text {
    margin-left: 8px;
    color: black;
    font-weight: 500;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    white-space: nowrap;
    z-index: 2;
    font-size: 16px;

    @media (max-width: 1024px) {
      font-size: 15px;
    }
      
    @media (max-width: 600px) {
      font-size: 14px;
    }
  }

  &:hover .home-text {
    opacity: 1;
    transform: translateX(0);
  }
`;