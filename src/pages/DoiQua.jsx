import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalStyle } from "./styles/HomePage.styles";
import styled from "styled-components";
import {
  getAvailableRewards,
  exchangeReward,
  getExchangedRewards,
} from "../services/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* ===== STYLE ===== */
const PageWrapper = styled.main`
  padding: 20px;
  font-family: "Montserrat-SemiBold", sans-serif;
  min-height: 80vh;
  background: linear-gradient(to bottom, #64b5f6, #bbdefb, #e3f2fd);
`;

const PageTitle = styled.h1`
  font-family: "Impress", sans-serif;
  font-size: 32px;
  margin-bottom: 20px;
  color: #2e2e2e;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
`;

const NutsBox = styled.div`
  display: inline-block;
  background: #fff7e6;
  padding: 10px 18px;
  border-radius: 10px;
  border: 2px solid #ffb300;
  font-size: 18px;
  color: #ff6f00;
  margin-bottom: 25px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const RewardCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transition: 0.3s;
  border-top: 6px solid #c62828;
  opacity: ${(p) => (p.$outOfStock ? 0.4 : 1)};
  pointer-events: ${(p) => (p.$outOfStock ? "none" : "auto")};
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 15px 25px rgba(0,0,0,0.25);
  }
`;

const RewardImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const RewardName = styled.h3`
  margin: 10px 0;
  font-size: 20px;
  color: #2e2e2e;
`;

const RewardNuts = styled.p`
  color: #d32f2f;
  font-size: 16px;
  margin-bottom: 8px;
`;

const StockText = styled.p`
  font-size: 14px;
  color: #2e7d32;
  margin-bottom: 12px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background: ${(p) =>
    p.disabled ? "#ccc" : p.$isExchanged ? "#757575" : "#2e7d32"};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: 0.25s;
  &:hover {
    background: ${(p) =>
      p.disabled || p.$isExchanged ? "#757575" : "#1b5e20"};
  }
`;

const SnowContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;

  .snow {
    position: absolute;
    top: -2vh;
    font-size: 14px;          /* chỉnh to nhỏ bông */
    color: white;             /* màu */
    opacity: 0.9;
    animation: fall linear infinite;
  }

  @keyframes fall {
    0% {
      transform: translate(0, -5vh) rotate(0deg);
    }
    100% {
      transform: translate(calc(20vw - 40vw * var(--dir)), 105vh) rotate(360deg);
      opacity: 0.2;
    }
  }
`;

/* ===== HELPER ===== */
const normalizeReward = (item) => {
  if (item.rewardId && typeof item.rewardId === "object") {
    return { _id: item.rewardId._id, ...item.rewardId };
  }
  return item;
};

/* ===== COMPONENT ===== */
function DoiQua() {
  const [rewards, setRewards] = useState([]);
  const [exchanged, setExchanged] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("selectedStudent"));
    const studentId = localStorage.getItem("studentId");
    if (studentData) setStudent(studentData);

    if (studentId) {
      Promise.all([
        getAvailableRewards(studentId),
        getExchangedRewards(studentId),
      ])
        .then(([availRes, exchangedRes]) => {
          const avail = (availRes.data.data || []).map(normalizeReward);
          const exch = (exchangedRes.data.data || []).map(normalizeReward);
          const merged = [...avail, ...exch].reduce((acc, cur) => {
            if (!acc.some((r) => r._id === cur._id)) acc.push(cur);
            return acc;
          }, []);
          setRewards(merged);
          setExchanged(exch);
        })
        .catch((err) => console.error("Lỗi load reward:", err));
    }
  }, []);

  const handleExchange = async (rewardId) => {
    try {
      const studentId = localStorage.getItem("studentId");
      const rewardFromState = rewards.find((r) => r._id === rewardId);
      const cost = rewardFromState?.nuts || 0;

      const res = await exchangeReward(rewardId, studentId);
      toast.success(
        <div style={{ whiteSpace: "pre-line" }}>
          {res.data?.message || "Đổi quà thành công!"}
        </div>,
        { position: "top-center", autoClose: 1500 }
      );

      const [availRes, exchangedRes] = await Promise.all([
        getAvailableRewards(studentId),
        getExchangedRewards(studentId),
      ]);

      const avail = (availRes.data.data || []).map(normalizeReward);
      const exch = (exchangedRes.data.data || []).map(normalizeReward);

      const merged = [...avail, ...exch].reduce((acc, cur) => {
        if (!acc.some((r) => r._id === cur._id)) acc.push(cur);
        return acc;
      }, []);

      setRewards(merged);
      setExchanged(exch);

      // UPDATE NUTS
      const selectedStudent = JSON.parse(localStorage.getItem("selectedStudent"));
      const newNuts = Math.max((selectedStudent?.nuts || 0) - cost, 0);
      const updatedStudent = { ...selectedStudent, nuts: newNuts };
      localStorage.setItem("selectedStudent", JSON.stringify(updatedStudent));
      setStudent(updatedStudent);
      window.dispatchEvent(new Event("studentUpdated"));
    } catch (error) {
      alert(error.response?.data?.message || "Không thể đổi quà!");
    }
  };

  const checkExchangeStatus = (rewardId) =>
    exchanged.some((r) => r._id === rewardId);

  return (
    <>
      <GlobalStyle />
      <SnowContainer>
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="snow"
            style={{
              left: Math.random() * 100 + "vw",
              animationDuration: 5 + Math.random() * 6 + "s",
              animationDelay: Math.random() * 5 + "s",
              fontSize: 20 + Math.random() * 20 + "px",
              '--dir': Math.random() > 0.5 ? 1 : 0, // ngẫu nhiên hướng gió
            }}
          >
            ❄
          </span>
        ))}
      </SnowContainer>
      <Header />
      <PageWrapper>
        <PageTitle>🎁 ĐỔI QUÀ 🎁</PageTitle>

        {student && <NutsBox>🌰 Hạt dẻ của bạn: <b>{student.nuts}</b></NutsBox>}

        <GridWrapper>
          {rewards.map((item) => {
            const isExchanged = checkExchangeStatus(item._id);
            const enoughNuts = student && student.nuts >= item.nuts;

            let buttonLabel = "Đổi quà";
            let disabled = false;
            if (item.stock === 0) { buttonLabel = "Hết quà"; disabled = true; }
            else if (!enoughNuts) { buttonLabel = "Không đủ hạt dẻ"; disabled = true; }

            return (
              <RewardCard key={item._id} $outOfStock={item.stock === 0}>
                <RewardImage src={item.image} alt={item.name} />
                <RewardName>{item.name}</RewardName>
                <RewardNuts>🌰 {item.nuts} hạt dẻ</RewardNuts>
                <StockText>
                  {item.stock === -1 ? "♾ Không giới hạn" : `Còn lại: ${item.stock}`}
                </StockText>
                <Button
                  onClick={() => handleExchange(item._id)}
                  disabled={disabled}
                  $outOfStock={item.stock === 0}
                >
                  {buttonLabel}
                </Button>
              </RewardCard>
            );
          })}
        </GridWrapper>
      </PageWrapper>
      <Footer />
    </>
  );
}

export default DoiQua;
