// src/components/Footer.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const moveWave = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const FooterSection = styled.footer`
  --footer-bg: #0f1720;       /* nền footer */
  --wave-1: rgba(255,255,255,0.06);
  --wave-2: rgba(255,255,255,0.04);
  --wave-3: rgba(255,255,255,0.02);
  --text: #fff;
  background: var(--footer-bg);
  color: var(--text);
  padding: 60px 20px 60px; /* bottom padding để chừa chỗ cho wave */
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;

  .footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    gap: 40px;
    position: relative;
    z-index: 2; /* trên sóng */
  }

  .footer-column {
    flex: 1 1 250px;
    min-width: 200px;
  }

  .logo {
    max-width: 140px;
    height: auto;
    margin-bottom: 8px;
    display: block;
  }

  .footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-column ul li {
    margin-bottom: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.25s;
  }

  .footer-column ul li:hover {
    color: #4caf50;
  }

  .social-icons {
    display: flex;
    gap: 12px;
    margin-top: 12px;
  }

  .social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: rgba(255,255,255,0.05);
    color: var(--text);
    font-size: 16px;
    transition: all 0.25s ease;
  }

  .social-icons a:hover {
    background-color: #4caf50;
    color: white;
  }

  .footer-bottom {
    margin-top: 30px;
    text-align: center;
    font-size: 14px;
    color: #bfc7cf;
    border-top: 1px solid rgba(255,255,255,0.03);
    padding-top: 20px;
    position: relative;
    z-index: 2;
  }

  /* Wave container (ở dưới cùng) */
  .wave-wrap {
    position: absolute;
    top: 30;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px; /* chiều cao vùng sóng */
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  .waves {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 200%;
    height: 160px;
    transform: translate3d(0,0,0);
  }

  /* 3 lớp sóng với tốc độ/opacity khác nhau */
  .wave-1 {
    top: 10;
    animation: ${moveWave} 18s linear infinite;
    opacity: 1;
    fill: var(--wave-1);
  }
  .wave-2 {
    top: 16px;
    animation: ${moveWave} 12s linear infinite;
    opacity: 1;
    fill: var(--wave-2);
  }
  .wave-3 {
    top: 32px;
    animation: ${moveWave} 9s linear infinite;
    opacity: 1;
    fill: var(--wave-3);
  }

  /* responsiveness */
  @media (max-width: 768px) {
    .footer-container { gap: 20px; padding-bottom: 20px; }
    padding-bottom: 140px;
  }
`;

function Footer() {
  return (
    <FooterSection>
      <div className="footer-container">
        <div className="footer-column">
          <img src="/logo_white.png" alt="Athena Education Logo" className="logo" />
          <p>
            Nền tảng học tập thông minh giúp học sinh, phụ huynh và giáo viên kết nối và phát triển.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Liên kết</h3>
          <ul>
            <li>Trang chủ</li>
            <li>Toán</li>
            <li>Tiếng Việt</li>
            <li>Thi thử</li>
            <li>Xếp hạng</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Liên hệ</h3>
          <ul>
            <li>Email: support@athena.edu.vn</li>
            <li>Hotline: 0123 456 789</li>
            <li>Địa chỉ: TP Hồ Chí Minh</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Athena Education. All rights reserved.
      </div>

      {/* Wave SVG: duplicate path để có chuyển động seamless (width 200% + translate) */}
      <div className="wave-wrap" aria-hidden="true">
        <svg className="waves wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C150,140 350,0 600,40 C850,80 1050,10 1200,40 L1200,120 L0,120 Z" />
        </svg>

        <svg className="waves wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,0 350,120 600,60 C850,0 1000,120 1200,60 L1200,120 L0,120 Z" />
        </svg>

        <svg className="waves wave-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,50 C180,120 380,20 600,50 C820,80 980,20 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </FooterSection>
  );
}

export default Footer;
