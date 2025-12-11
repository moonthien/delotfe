import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImg from "../assets/bgimg2.png";
import { getAllSubjects, getLeaderboardBySubject } from "../services/apiService";
import { GlobalStyle } from "./styles/HomePage.styles";

// ================= Styled Components =================
const Container = styled.div`
  padding: 48px;
  background-image: url(${bgImg});
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 32px;
  text-align: center;
  color: #2e2e2e;
  margin-bottom: 24px;
  font-family: "Impress", sans-serif;
`;

const FilterBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 16px;
  transition: all 0.3s ease;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const TableCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background: #f4f6f7;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
`;

const RankIcon = styled.span`
  font-size: 20px;
`;

// ================= Component =================
function RankingPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getAllSubjects();
        setSubjects(res.data?.data || []);
      } catch (err) {
        console.error("❌ Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // 🔹 Filter subjects when grade changes
  useEffect(() => {
    if (selectedGrade) {
      const filtered = subjects.filter(
        (s) => s.grade === parseInt(selectedGrade)
      );
      setFilteredSubjects(filtered);
      // Reset subject when grade changes
      setSelectedSubject("");
    }
  }, [selectedGrade, subjects]);

  // 🔹 Fetch leaderboard when subject is selected
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedSubject) return;
      try {
        setLoading(true);
        const res = await getLeaderboardBySubject(selectedSubject);
        const data = res.data?.data?.leaderboard || [];
        setLeaderboard(data);
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedSubject]);

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <Title>BẢNG XẾP HẠNG HỌC SINH</Title>

        {/* Filter section */}
        <FilterBox>
          <Select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">-- Chọn lớp --</option>
            {[1, 2, 3, 4, 5].map((g) => (
              <option key={g} value={g}>
                Lớp {g}
              </option>
            ))}
          </Select>

          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedGrade}
          >
            <option value="">-- Chọn môn học --</option>
            {filteredSubjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FilterBox>

        {/* Leaderboard table */}
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>STT</Th>
                <Th>Họ và tên</Th>
                <Th>Tổng thời gian</Th>
                <Th>Điểm cao nhất</Th>
                <Th>Tổng điểm</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <Td colSpan="5">Đang tải...</Td>
                </tr>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((item, index) => (
                  <tr key={index}>
                    <Td>
                      {item.rank === 1 ? (
                        <RankIcon>🥇</RankIcon>
                      ) : item.rank === 2 ? (
                        <RankIcon>🥈</RankIcon>
                      ) : item.rank === 3 ? (
                        <RankIcon>🥉</RankIcon>
                      ) : (
                        item.rank
                      )}
                    </Td>
                    <Td>{item.studentName}</Td>
                    <Td>{item.totalTimeDisplay}</Td>
                    <Td>{item.bestScore}</Td>
                    <Td style={{ color: "#dc3545", fontWeight: 600 }}>
                      {item.totalScore}
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="5">Chưa có dữ liệu xếp hạng</Td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableCard>
      </Container>
      <Footer />
    </>
  );
}

export default RankingPage;