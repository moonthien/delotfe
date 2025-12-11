import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Impress';
    src: url('/fonts/SVN-Impress.otf') format('opentype');
  }

  @font-face {
    font-family: 'SmoochSans-Medium';
    src: url('/fonts/SmoochSans-Medium.ttf') format('truetype');
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    font-family: "Montserrat-SemiBold", sans-serif;
    background: #f9f9f9;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  padding: 8px 130px;
  gap: 20px;
  padding-bottom: 30px;
`;

export const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
`;

export const Name = styled.h2`
  font-size: 18px;
  margin: 10px 0 5px;
`;

export const Grade = styled.div`
  font-size: 15px;
  color: #777;
`;

export const UpdateAvatar = styled.button`
  margin: 10px 0 20px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: #ffe9e2;
  color: #d75c2f;
  cursor: pointer;
  font-size: 14px;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const MenuItem = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 20px;
    height: 20px;
  }

  &.active {
    background: #e6f7e6;
    color: #2f9d2f;
    font-weight: 600;
  }
  &:hover {
    background: #f4f4f4;
  }
`;

export const Content = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 20px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const HeaderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h3 {
    color: #2f9d2f;
    font-size: 18px;
  }
`;

export const UpdateBtn = styled.button`
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #2f9d2f;
    color: #fff;
  }
`;

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  font-size: 15px;
  gap: 6px;
  align-items: center;
`;

export const Label = styled.div`
  font-weight: 600;
  min-width: 150px;
`;

export const Value = styled.div`
  color: #333;
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2f9d2f;
  }

  &::placeholder {
    color: #999;
  }
`;

export const Message = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 16px;
`;

export const ExamHistoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ExamHistoryCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const ExamHistoryRow = styled.div`
  display: flex;
  font-size: 15px;
  gap: 6px;
  padding: 8px 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 500px;
  text-align: center;
`;

export const UploadContainer = styled.div`
  margin: 20px 0;
`;

export const UploadCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f9f9f9;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

export const PlusSign = styled.div`
  font-size: 30px;
  color: #2f9d2f;
  font-weight: bold;
`;

export const UploadText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;

export const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 20px 0;

  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: 0.2s;
  }

  img:hover {
    border-color: #2f9d2f;
  }
`;

export const CloseBtn = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background: #ccc;
  border-radius: 8px;
  cursor: pointer;
`;

export const ConfirmBtn = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background: #2f9d2f;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #1e7b1e;
  }
`;

export const ResultsTable = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px 10px;
    text-align: center;
  }

  th {
    background: #f1f1f1;
    font-weight: bold;
    color: #333;
  }

  tr:nth-child(even) {
    background: #fafafa;
  }

  tr:hover {
    background: #f5fdf5;
  }
`;

// Bảng lịch sử bài làm hiện đại - không viền giữa cột
export const ModernHistoryTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: 10px;
  font-size: 14.5px;

  thead {
    th {
      text-align: left;
      padding: 12px 16px;
      background: #2f9d2f;
      color: white;
      font-weight: 600;
      font-size: 15px;
      position: sticky;
      top: 0;
      z-index: 1;

      &:first-child {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }
      &:last-child {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }
    }
  }

  tbody {
    tr {
      background: #f8fcf8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;

      &:hover {
        background: #e8f7e8;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(47, 157, 47, 0.15);
      }

      td {
        padding: 14px 16px;
        border: none;
        position: relative;

        &:first-child {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          font-weight: 600;
          color: #2f9d2f;
        }
        &:last-child {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 152px;       /* bạn đổi tùy ý */
    max-width: 152px;
    min-width: 152px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 120px;       /* bạn đổi tùy ý */
    max-width: 120px;
    min-width: 120px;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 88px;       /* bạn đổi tùy ý */
    max-width: 88px;
    min-width: 88px;
  }
`;

// Badge điểm số đẹp mắt
export const ScoreBadge = styled.span`
  display: inline-block;
  min-width: 48px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  color: white;
  background: ${(props) => {
    if (props.score >= 90) return "#1e7b1e";
    if (props.score >= 70) return "#2f9d2f";
    if (props.score >= 50) return "#f9a825";
    return "#e74c3c";
  }};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

// Cột Đúng - màu xanh
export const CorrectText = styled.span`
  color: #2f9d2f;
  font-weight: 700;
  padding: 4px 8px;
  background: #e8f7e8;
  border-radius: 6px;
  font-size: 14px;
`;

// Cột Sai - màu đỏ
export const WrongText = styled.span`
  color: #e74c3c;
  font-weight: 700;
  padding: 4px 8px;
  background: #ffeaea;
  border-radius: 6px;
  font-size: 14px;
`;

// Badge hiển thị level ôn tập: Dễ / Trung bình / Nâng cao
export const LevelBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: ${(props) => {
    switch (props.level) {
      case "de": return "#4CAF50"; // Xanh lá - Dễ
      case "trungbinh": return "#FF9800"; // Cam - Trung bình
      case "nangcao": return "#F44336"; // Đỏ - Nâng cao
      default: return "#9E9E9E"; // Xám - Không rõ
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Card thống kê nhỏ
export const StatsCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
  font-family: "Montserrat-SemiBold", sans-serif;
`;

export const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fcf8 100%);
  border-radius: 16px;
  padding: 16px 20px;
  min-width: 180px;
  flex: 1;
  box-shadow: 0 4px 15px rgba(47, 157, 47, 0.1);
  border: 1px solid #e8f7e8;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(47, 157, 47, 0.18);
  }
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2f9d2f;
  margin: 8px 0;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const DetailBtn = styled.button`
  padding: 6px 12px;
  background: #2f9d2f;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s ease;

  &:hover {
    background: #1e7b1e;
  }
`;

export const ScrollTextCell = styled.td`
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  padding: 12px;
  
  .scroll-text {
    display: inline-block;
    white-space: nowrap;
    transform: translateX(0);
    transition: transform 0.3s linear;

    /* Mặc định KHÔNG scroll */
    --shouldScroll: paused;
  }

  /* Nếu nội dung bị tràn, tự bật scroll */
  &.overflowed .scroll-text {
    --shouldScroll: running;
  }

  &:hover .scroll-text {
    animation: scrollText 8s linear infinite;
    animation-play-state: var(--shouldScroll);
  }

  @keyframes scrollText {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;