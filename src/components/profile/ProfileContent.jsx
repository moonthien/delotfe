import React, { useEffect, useState } from "react";
import {
  Content,
  HeaderInfo,
  UpdateBtn,
  InfoGrid,
  InfoRow,
  Label,
  Value,
  StyledInput,
  Message,
  ExamHistoryGrid,
  ExamHistoryCard,
  ExamHistoryRow,
  ResultsTable,
  ModernHistoryTable,
  ScoreBadge,
  CorrectText,
  WrongText,
  LevelBadge,
  StatsCardsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ScrollTextCell,
} from "../../pages/styles/ProfilePage.styles";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "../CountUp";

const ProfileContent = ({
  activeSection,
  student,
  isEditing,
  editName,
  editClass,
  editDob,
  oldPassword,
  newPassword,
  confirmPassword,
  otpCode,
  pwdLoading,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  setOtpCode,
  setEditName,
  setEditClass,
  setEditDob,
  filteredExamHistory,
  filterType,
  setFilterType,
  handleSaveInfo,
  setIsEditing,
  handleSendOtp,
  handleChangePassword,
  formatTime,
  formatDate,
  currentExam,
  handleSort,
  sortConfig,
  handlePreviousPage,
  handleNextPage,
  currentPage,
  totalPages,
  badges,
  AchievementsContainer,
  FilterContainer,
  FilterSelect,
  PaginationContainer,
  PaginationButton,
  chartType,
  setChartType,
}) => {
  const [questionTextMap, setQuestionTextMap] = useState({});
  const [statsMode, setStatsMode] = useState("general");
  const [showWrongQuestions, setShowWrongQuestions] = useState(false);
  // Gom nhóm kết quả theo ngày
  const groupedByDate = filteredExamHistory.reduce((acc, r) => {
    const date = new Date(r.createdAt).toLocaleDateString("vi-VN");
    if (!acc[date]) acc[date] = [];
    acc[date].push(r.score);
    return acc;
  }, {});

  // Tính điểm trung bình cho mỗi ngày
  // Gom nhóm kết quả theo ngày và tính điểm trung bình
  const chartData = Object.entries(
    filteredExamHistory.reduce((acc, r) => {
      const date = new Date(r.createdAt).toLocaleDateString("vi-VN");
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += r.score;
      acc[date].count += 1;
      return acc;
    }, {})
  )
    .map(([date, { total, count }]) => ({
      date,
      score: Math.round(total / count), // điểm trung bình mỗi ngày
    }))
    .sort(
      (a, b) =>
        new Date(a.date.split("/").reverse().join("-")) -
        new Date(b.date.split("/").reverse().join("-"))
    );

  // THÊM MỚI: recentChartData cho phần "stats" - dựa trên 10 kết quả gần nhất (khớp với bảng)
  const recentChartData = [...filteredExamHistory]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp mới nhất trước
    .slice(0, 10) // Lấy 10 kết quả gần nhất
    .map((r, idx) => ({
      name: `Bài ${10 - idx}`, // Đánh số từ mới nhất (Bài 10 là cũ nhất trong 10)
      score: r.score,
      date: formatDate(r.createdAt),
      subject:
        r.refId?.subjectId?.name ||
        r.refId?.topicId?.subjectId?.name ||
        r.refId?.topicId?.name ||
        "Không rõ",
      period:
        r.refType === "Lesson"
          ? "Ôn tập"
          : r.refId?.period || r.refId?.name || "Không rõ",
      correctAnswers: r.correctAnswers,
      totalQuestions: r.answers.length,
      timeSpent: formatTime(r.timeSpent),
    }));

  // ===============================
  // 🔥 Thống kê câu sai nhiều nhất
  // ===============================
  const wrongQuestionStats = filteredExamHistory
    .flatMap((r) => r.answers) // tất cả câu trả lời
    .filter((a) => !a.isCorrect) // chỉ lấy câu sai
    .reduce((acc, ans) => {
      const id = ans.questionId;
      if (!acc[id]) acc[id] = 0;
      acc[id] += 1;
      return acc;
    }, {});

  // ============================
  // 🔥 Fetch all questions by lesson/exam IDs
  // ============================
  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        const lessonIds = [
          ...new Set(filteredExamHistory.map((r) => r.refId?._id)),
        ];
        let map = {}; // Đổi tên thành questionMap để rõ
        for (const lessonId of lessonIds) {
          const type = filteredExamHistory.find(
            (r) => r.refId?._id === lessonId
          )?.refType;
          const url =
            type === "Lesson"
              ? `https://kltnbe-production.up.railway.app/v1/api/questions/lesson/${lessonId}`
              : `https://kltnbe-production.up.railway.app/v1/api/questions/exam/${lessonId}`;

          const res = await fetch(url);
          const json = await res.json();

          if (json.success && Array.isArray(json.data)) {
            json.data.forEach((set) => {
              set.questions.forEach((q) => {
                map[q._id] = {
                  text: q.questionText,
                  correct: q.correctAnswer,
                };
              });
            });
          }
        }
        setQuestionTextMap(map); // Giữ tên state, nhưng giờ là object {text, correct}
      } catch (err) {
        console.error("Failed to load questions:", err);
      }
    };
    if (filteredExamHistory.length > 0) {
      fetchAllQuestions();
    }
  }, [filteredExamHistory]);

  // Gom thêm thông tin đáp án đã chọn & đáp án đúng
  const wrongAnswersDetail = filteredExamHistory
    .flatMap((r) => r.answers.filter((a) => !a.isCorrect))
    .reduce((acc, ans) => {
      const id = ans.questionId;
      if (!acc[id]) {
        acc[id] = {
          chosenAnswers: [], // Chỉ giữ chosen
        };
      }
      acc[id].chosenAnswers.push(ans.selected); // Fix typo: ans.selected thay vì ans.selectedAnswer
      return acc;
    }, {});

  const topWrongQuestions = Object.entries(wrongQuestionStats)
    .map(([questionId, count]) => {
      // Tìm bài học/exam chứa câu hỏi này
      const parentResult = filteredExamHistory.find((r) =>
        r.answers.some((a) => a.questionId === questionId)
      );

      return {
        questionId,
        count,
        text: questionTextMap[questionId]?.text || "Không tìm thấy câu hỏi",
        chosenAnswers: wrongAnswersDetail[questionId]?.chosenAnswers || [],
        correctAnswer: questionTextMap[questionId]?.correct || "N/A",

        // Thêm MÔN HỌC
        subject:
          parentResult?.refId?.subjectId?.name ||
          parentResult?.refId?.topicId?.subjectId?.name ||
          parentResult?.refId?.topicId?.name ||
          "Không rõ",

        // Thêm LOẠI BÀI
        type:
          parentResult?.refType === "Lesson"
            ? "Ôn tập"
            : parentResult?.refId?.period ||
              parentResult?.refId?.name ||
              "Không rõ",
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const donutColors = [
    "#e74c3c",
    "#ff7675",
    "#fab1a0",
    "#ffeaa7",
    "#fd79a8",
    "#74b9ff",
    "#55efc4",
    "#a29bfe",
    "#fdcb6e",
    "#81ecec",
  ];

  // Helper functions for table data
  const getSubjectName = (result) => {
    return (
      result.refId?.subjectId?.name ||
      result.refId?.topicId?.subjectId?.name ||
      result.refId?.topicId?.name ||
      "Không rõ"
    );
  };

  const getTypeName = (result) => {
    return result.refType === "Lesson"
      ? "Ôn tập"
      : result.refId?.period || result.refId?.name || "Không rõ";
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === "asc") return "↑";
    if (sortConfig.direction === "desc") return "↓";
    return null;
  };

  return (
    <Content>
      {activeSection === "profile" && (
        <>
          <HeaderInfo>
            <h3>Thông tin cá nhân</h3>
            {!isEditing ? (
              <UpdateBtn onClick={() => setIsEditing(true)}>
                {" "}
                Cập nhật ✏️{" "}
              </UpdateBtn>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <UpdateBtn onClick={() => setIsEditing(false)}>
                  Quay lại
                </UpdateBtn>
                <UpdateBtn onClick={handleSaveInfo}>💾 Lưu</UpdateBtn>
              </div>
            )}
          </HeaderInfo>

          {!isEditing ? (
            <InfoGrid>
              <InfoRow>
                <Label>Họ tên:</Label>
                <Value>{student?.name}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Lớp:</Label>
                <Value>{student?.class || "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Ngày sinh:</Label>
                <Value>
                  {student?.dateofBirth
                    ? new Date(student.dateofBirth).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>Email:</Label>
                <Value>{student?.userId?.email || "Chưa cập nhật"}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Huy hiệu:</Label>
                <Value>
                  <AchievementsContainer>
                    {badges.length > 0 ? (
                      badges.map((item) => (
                        <div key={item._id}>
                          <img
                            src={item.badgeId?.icon}
                            alt={item.badgeId?.title}
                            title={item.badgeId?.description}
                          />
                          <span>{item.badgeId?.title}</span>
                        </div>
                      ))
                    ) : (
                      <span>Chưa có huy hiệu</span>
                    )}
                  </AchievementsContainer>
                </Value>
              </InfoRow>
            </InfoGrid>
          ) : (
            <InfoGrid>
              <InfoRow>
                <Label>Họ tên:</Label>
                <StyledInput
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </InfoRow>
              <InfoRow>
                <Label>Lớp:</Label>
                <StyledInput
                  type="text"
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value)}
                />
              </InfoRow>
              <InfoRow>
                <Label>Ngày sinh:</Label>
                <StyledInput
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                />
              </InfoRow>
            </InfoGrid>
          )}
        </>
      )}

      {activeSection === "password" && (
        <>
          <HeaderInfo>
            <h3>Đổi mật khẩu</h3>
          </HeaderInfo>
          <InfoGrid>
            <InfoRow>
              <Label>Email:</Label>
              <StyledInput
                type="email"
                value={student?.userId?.email || ""}
                readOnly
              />
              <UpdateBtn onClick={handleSendOtp}>Gửi OTP</UpdateBtn>
            </InfoRow>
            <InfoRow>
              <Label>Mật khẩu cũ:</Label>
              <StyledInput
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
              />
            </InfoRow>
            <InfoRow>
              <Label>Mật khẩu mới:</Label>
              <StyledInput
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </InfoRow>
            <InfoRow>
              <Label>Xác nhận mật khẩu:</Label>
              <StyledInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
              />
            </InfoRow>
            <InfoRow>
              <Label>OTP:</Label>
              <StyledInput
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                placeholder="Nhập mã OTP (6 số)"
              />
            </InfoRow>
            <InfoRow>
              <Label></Label>
              <UpdateBtn disabled={pwdLoading} onClick={handleChangePassword}>
                {pwdLoading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
              </UpdateBtn>
            </InfoRow>
          </InfoGrid>
        </>
      )}

      {activeSection === "history" && (
        <>
          <HeaderInfo>
            <h3>Lịch sử bài làm</h3>
          </HeaderInfo>

          <FilterContainer style={{ marginBottom: "10px" }}>
            <Label>Lọc theo loại bài:</Label>
            <FilterSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="Ôn tập">Ôn tập</option>
              <option value="Kiểm tra">Kiểm tra</option>
            </FilterSelect>
          </FilterContainer>

          {/* THỐNG KÊ NHỎ DƯỚI FILTER */}
          <StatsCardsContainer as={motion.div} layout>
            <AnimatePresence mode="popLayout">
              {/* 1. Độ chính xác trung bình */}
              <motion.div
                key="accuracy"
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <StatCard>
                  <StatLabel>Độ chính xác trung bình</StatLabel>
                  <StatValue>
                    <CountUp
                      end={
                        filteredExamHistory.length > 0
                          ? Math.round(
                              filteredExamHistory.reduce(
                                (sum, r) => sum + r.score,
                                0
                              ) / filteredExamHistory.length
                            )
                          : 0
                      }
                      duration={2200}
                      startWhen={true}
                      suffix="%"
                    />
                  </StatValue>
                </StatCard>
              </motion.div>

              {/* 2. Ôn tập - chỉ hiện khi cần */}
              <AnimatePresence>
                {(filterType === "all" || filterType === "Ôn tập") && (
                  <>
                    <motion.div
                      key="total-ontap"
                      layout
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <StatCard>
                        <StatLabel>Tổng thời gian ôn tập</StatLabel>
                        <StatValue>
                          <CountUp
                            end={filteredExamHistory
                              .filter((r) => r.refType === "Lesson")
                              .reduce((sum, r) => sum + (r.timeSpent || 0), 0)}
                            duration={2400}
                            startWhen={true}
                            prefix=""
                            suffix=" giây"
                          />
                        </StatValue>
                      </StatCard>
                    </motion.div>

                    <motion.div
                      key="avg-ontap"
                      layout
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <StatCard>
                        <StatLabel>TB thời gian ôn tập</StatLabel>
                        <StatValue>
                          {(() => {
                            const ontap = filteredExamHistory.filter(
                              (r) => r.refType === "Lesson"
                            );
                            const avg =
                              ontap.length > 0
                                ? Math.round(
                                    ontap.reduce(
                                      (sum, r) => sum + r.timeSpent,
                                      0
                                    ) / ontap.length
                                  )
                                : 0;
                            return (
                              <CountUp
                                end={avg}
                                duration={2000}
                                startWhen={true}
                                suffix=" giây"
                              />
                            );
                          })()}
                        </StatValue>
                      </StatCard>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 3. Kiểm tra */}
              <AnimatePresence>
                {(filterType === "all" || filterType === "Kiểm tra") && (
                  <>
                    <motion.div
                      key="total-kiemtra"
                      layout
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <StatCard>
                        <StatLabel>Tổng thời gian kiểm tra</StatLabel>
                        <StatValue>
                          <CountUp
                            end={filteredExamHistory
                              .filter((r) => r.refType !== "Lesson")
                              .reduce((sum, r) => sum + (r.timeSpent || 0), 0)}
                            duration={2400}
                            startWhen={true}
                            suffix=" giây"
                          />
                        </StatValue>
                      </StatCard>
                    </motion.div>

                    <motion.div
                      key="avg-kiemtra"
                      layout
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <StatCard>
                        <StatLabel>TB thời gian kiểm tra</StatLabel>
                        <StatValue>
                          {(() => {
                            const kt = filteredExamHistory.filter(
                              (r) => r.refType !== "Lesson"
                            );
                            const avg =
                              kt.length > 0
                                ? Math.round(
                                    kt.reduce(
                                      (sum, r) => sum + r.timeSpent,
                                      0
                                    ) / kt.length
                                  )
                                : 0;
                            return (
                              <CountUp
                                end={avg}
                                duration={2000}
                                startWhen={true}
                                suffix=" giây"
                              />
                            );
                          })()}
                        </StatValue>
                      </StatCard>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </AnimatePresence>
          </StatsCardsContainer>

          {filteredExamHistory.length === 0 ? (
            <Message>Chưa có lịch sử bài làm</Message>
          ) : (
            <>
              {/* Bảng hiện đại mới */}
              <ModernHistoryTable>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("subject")}>
                      Môn học
                      {sortConfig.key === "subject" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "subject" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("type")}>
                      Loại bài
                      {sortConfig.key === "type" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "type" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("score")}>
                      Điểm
                      {sortConfig.key === "score" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "score" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("correct")}>
                      Đúng
                      {sortConfig.key === "correct" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "correct" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("wrong")}>
                      Sai
                      {sortConfig.key === "wrong" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "wrong" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("time")}>
                      Thời gian
                      {sortConfig.key === "time" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "time" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                    <th onClick={() => handleSort("date")}>
                      Ngày làm
                      {sortConfig.key === "date" &&
                        sortConfig.direction === "asc" &&
                        " ↑"}
                      {sortConfig.key === "date" &&
                        sortConfig.direction === "desc" &&
                        " ↓"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentExam.map((result, index) => {
                    const totalQuestions = result.answers.length;
                    const correct = result.correctAnswers;
                    const wrong = totalQuestions - correct;

                    return (
                      <tr key={result._id}>
                        <td>
                          {result.refId?.subjectId?.name ||
                            result.refId?.topicId?.subjectId?.name ||
                            result.refId?.topicId?.name ||
                            "Không rõ"}
                        </td>
                        <ScrollTextCell
                          ref={(el) => {
                            if (!el) return;
                            const textEl = el.querySelector(".scroll-text");
                            if (textEl && textEl.scrollWidth > el.clientWidth) {
                              el.classList.add("overflowed");
                            } else {
                              el.classList.remove("overflowed");
                            }
                          }}
                        >
                          <div className="scroll-text">
                            {result.refType === "Lesson" ? (
                              <>
                                {result.refId?.order &&
                                  ` - Bài ${result.refId.order}: `}
                                {result.refId?.title || "Không rõ tên bài"}
                                {" - "}
                                <LevelBadge level={result.level || "trungbinh"}>
                                  {result.level === "de"
                                    ? "Dễ"
                                    : result.level === "trungbinh"
                                    ? "Trung bình"
                                    : result.level === "nangcao"
                                    ? "Nâng cao"
                                    : "Không rõ"}
                                </LevelBadge>
                                {result.isAIPractice && " - AI"}
                              </>
                            ) : (
                              <>
                                {result.refId?.period ||
                                  result.refId?.name ||
                                  "Không rõ"}
                                {result.isAIPractice && " - AI"}
                              </>
                            )}
                          </div>
                        </ScrollTextCell>
                        <td>
                          <ScoreBadge score={result.score}>
                            {result.score}
                          </ScoreBadge>
                        </td>
                        <td>
                          <CorrectText>
                            {correct}/{totalQuestions}
                          </CorrectText>
                        </td>
                        <td>
                          <WrongText>
                            {wrong}/{totalQuestions}
                          </WrongText>
                        </td>
                        <ScrollTextCell
                          style={{ maxWidth: "80px" }}
                          ref={(el) => {
                            if (!el) return;
                            const textEl = el.querySelector(".scroll-text");
                            if (textEl && textEl.scrollWidth > el.clientWidth) {
                              el.classList.add("overflowed");
                            } else {
                              el.classList.remove("overflowed");
                            }
                          }}
                        >
                          <div className="scroll-text">
                            {formatTime(result.timeSpent)}
                          </div>
                        </ScrollTextCell>
                        <td>{formatDate(result.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </ModernHistoryTable>

              <PaginationContainer>
                <PaginationButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  ←
                </PaginationButton>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
                <PaginationButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  →
                </PaginationButton>
              </PaginationContainer>
            </>
          )}

          {/* BIỂU ĐỒ TIẾN BỘ NHỎ - MỚI */}
          {filteredExamHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                margin: "20px 0",
                background: "#fff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  color: "#2f9d2f",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                Xu hướng điểm số theo ngày
              </h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => `ĐTB ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2f9d2f"
                    strokeWidth={2.5}
                    dot={{ fill: "#2f9d2f", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* BIỂU ĐỒ SO SÁNH SỐ CÂU ĐÚNG/SAI THEO BÀI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  marginTop: "25px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#2f9d2f",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  So sánh số câu đúng / sai theo bài
                </h4>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={filteredExamHistory.map((r, idx) => ({
                      name:
                        r.refType === "Lesson"
                          ? `Ôn tập ${idx + 1}`
                          : r.refId?.period ||
                            r.refId?.name ||
                            `Bài ${idx + 1}`,
                      correct: r.correctAnswers,
                      wrong: r.answers.length - r.correctAnswers,
                    }))}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        fontSize: "12px",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="correct" fill="#2f9d2f" name="Câu đúng" />
                    <Bar dataKey="wrong" fill="#e74c3c" name="Câu sai" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* BIỂU ĐỒ TRÒN - TỶ LỆ ĐÚNG/SAI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  marginTop: "25px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#2f9d2f",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  Tỷ lệ đúng / sai (toàn bộ bài làm)
                </h4>

                {filteredExamHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Đúng",
                            value: filteredExamHistory.reduce(
                              (sum, r) => sum + (r.correctAnswers || 0),
                              0
                            ),
                          },
                          {
                            name: "Sai",
                            value: filteredExamHistory.reduce(
                              (sum, r) =>
                                sum +
                                (r.answers.length - (r.correctAnswers || 0)),
                              0
                            ),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                      >
                        <Cell fill="#2f9d2f" />
                        <Cell fill="#e74c3c" />
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} câu`,
                          name === "Đúng" ? "Câu đúng" : "Câu sai",
                        ]}
                        contentStyle={{
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p>Chưa có dữ liệu</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </>
      )}

      {activeSection === "stats" && (
        <>
          <HeaderInfo>
            <h3>Thống kê học tập</h3>
          </HeaderInfo>

          {/* Bộ lọc và checkbox bật/tắt thống kê câu sai */}
          <FilterContainer
            style={{ alignItems: "center", flexWrap: "wrap", gap: "15px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Label>Lọc theo loại bài:</Label>
              <FilterSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Ôn tập">Ôn tập</option>
                <option value="Kiểm tra">Kiểm tra</option>
              </FilterSelect>
            </div>

            {/* Chỉ hiện "Kiểu biểu đồ" khi KHÔNG bật thống kê câu sai */}
            {!showWrongQuestions && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Label>Kiểu biểu đồ:</Label>
                <FilterSelect
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Biểu đồ cột</option>
                  <option value="line">Biểu đồ đường</option>
                </FilterSelect>
              </div>
            )}

            {/* Checkbox bật/tắt thống kê câu sai nhiều nhất */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginLeft: "auto",
              }}
            >
              <input
                type="checkbox"
                id="wrong-questions-toggle"
                checked={showWrongQuestions}
                onChange={(e) => setShowWrongQuestions(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <Label
                htmlFor="wrong-questions-toggle"
                style={{
                  margin: 0,
                  cursor: "pointer",
                  fontWeight: "600",
                  color: showWrongQuestions ? "#e74c3c" : "#555",
                }}
              >
                Thống kê câu sai nhiều nhất
              </Label>
            </div>
          </FilterContainer>

          {filteredExamHistory.length === 0 ? (
            <Message>Chưa có dữ liệu thống kê</Message>
          ) : (
            <>
              {/* Nội dung chính: bật/tắt theo checkbox */}
              <motion.div
                key={showWrongQuestions ? "wrong" : "general"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {showWrongQuestions ? (
                  /* ===== HIỂN THỊ KHI BẬT: CÂU SAI NHIỀU NHẤT ===== */
                  <>
                    {topWrongQuestions.length > 0 ? (
                      <>
                        {/* Biểu đồ câu sai nhiều nhất */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            margin: "25px 0",
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            boxShadow: "0 4px 15px rgba(231, 76, 60, 0.1)",
                            border: "1px solid #fce8e6",
                          }}
                        >
                          <h4
                            style={{
                              margin: "0 0 20px 0",
                              color: "#e74c3c",
                              fontSize: "18px",
                              fontWeight: "700",
                              textAlign: "center",
                            }}
                          >
                            Top 10 câu hỏi sai nhiều nhất
                          </h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={topWrongQuestions}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 80,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="4 4"
                                stroke="#f0f0f0"
                              />
                              <XAxis
                                dataKey="questionId"
                                interval="preserveStartEnd"
                                angle={-30}
                                textAnchor="end"
                                height={80}
                                tickFormatter={(id) => {
                                  const text =
                                    questionTextMap[id]?.text ||
                                    "Không có nội dung";
                                  return text.length > 18
                                    ? text.slice(0, 18) + "..."
                                    : text;
                                }}
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis allowDecimals={false} />
                              <Tooltip
                                formatter={(value) => `${value} lần sai`}
                                labelFormatter={(id) => {
                                  const q = topWrongQuestions.find(
                                    (t) => t.questionId === id
                                  );
                                  return q?.text || "Không rõ";
                                }}
                                contentStyle={{
                                  borderRadius: "8px",
                                  border: "none",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                              />
                              <Bar
                                dataKey="count"
                                fill="#e74c3c"
                                radius={[8, 8, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </motion.div>

                        <motion.div
                          style={{
                            margin: "25px 0",
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            boxShadow: "0 4px 15px rgba(231, 76, 60, 0.1)",
                            border: "1px solid #fce8e6",
                          }}
                        >
                          <h4 style={{ marginBottom: 12, color: "#e74c3c" }}>
                            Tỷ lệ sai của Top 10 câu hỏi
                          </h4>
                          <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                              <Pie
                                data={topWrongQuestions.map((q, index) => ({
                                  name:
                                    q.text.length > 30
                                      ? q.text.slice(0, 30) + "..."
                                      : q.text,
                                  value: q.count,
                                  fill: donutColors[index] || "#ccc", // fallback nếu thiếu
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={95}
                                dataKey="value"
                                label
                              ></Pie>
                              <Tooltip formatter={(v) => `${v} lần sai`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </motion.div>

                        {/* Bảng chi tiết câu sai */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            boxShadow: "0 4px 15px rgba(231, 76, 60, 0.1)",
                            border: "1px solid #fce8e6",
                          }}
                        >
                          <h4
                            style={{
                              margin: "0 0 15px 0",
                              color: "#e74c3c",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            Chi tiết câu hỏi sai nhiều nhất
                          </h4>
                          <div style={{ overflowX: "auto" }}>
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "14px",
                              }}
                            >
                              <thead>
                                <tr style={{ background: "#fdf2f2" }}>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "left",
                                      borderBottom: "2px solid #e74c3c",
                                    }}
                                  >
                                    Môn học
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                    }}
                                  >
                                    Loại bài
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                    }}
                                  >
                                    Câu hỏi
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                    }}
                                  >
                                    Lần sai
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                      width: "100px",
                                    }}
                                  >
                                    Đáp án chọn
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                    }}
                                  >
                                    Đáp án đúng
                                  </th>
                                  <th
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      borderBottom: "2px solid #e74c3c",
                                      width: "100px",
                                    }}
                                  >
                                    Độ nguy hiểm
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {topWrongQuestions.map((q, idx) => (
                                  <tr
                                    key={q.questionId}
                                    style={{
                                      background:
                                        idx % 2 === 0 ? "#fdfafa" : "#fff",
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "12px",
                                        minWidth: "110px",
                                        width: "110px",
                                      }}
                                    >
                                      {q.subject}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px",
                                        fontSize: "13.5px",
                                        minWidth: "180px",
                                      }}
                                    >
                                      {(() => {
                                        // Tìm kết quả chứa câu hỏi này
                                        const parentResult =
                                          filteredExamHistory.find((r) =>
                                            r.answers.some(
                                              (a) =>
                                                a.questionId === q.questionId
                                            )
                                          );
                                        if (!parentResult)
                                          return (
                                            <span style={{ color: "#95a5a6" }}>
                                              Không rõ
                                            </span>
                                          );

                                        if (parentResult.refType === "Lesson") {
                                          // === CASE 1: BÀI ÔN TẬP ===
                                          const topic =
                                            parentResult.refId?.topicId;
                                          const lesson = parentResult.refId;

                                          const topicName =
                                            topic?.name ||
                                            topic?.title ||
                                            "Ôn tập";
                                          const lessonOrder = lesson?.order
                                            ? `Bài ${lesson.order}`
                                            : lesson?.title?.match(/^Bài\s*\d+/)
                                            ? lesson.title.split(":")[0].trim()
                                            : "Bài luyện tập";
                                          const lessonTitle =
                                            lesson?.title || "Không có tiêu đề";
                                          const level =
                                            parentResult.level || lesson?.level;
                                          const levelText =
                                            level === "de"
                                              ? "Dễ"
                                              : level === "trungbinh"
                                              ? "Trung bình"
                                              : level === "nangcao"
                                              ? "Nâng cao"
                                              : "";
                                          const levelColor =
                                            level === "de"
                                              ? "#27ae60"
                                              : level === "trungbinh"
                                              ? "#f39c12"
                                              : "#e74c3c";
                                          const levelBg =
                                            level === "de"
                                              ? "#d5f5e3"
                                              : level === "trungbinh"
                                              ? "#fef9e7"
                                              : "#fadadd";

                                          return (
                                            <div style={{ lineHeight: "1.45" }}>
                                              <div
                                                style={{
                                                  fontWeight: "600",
                                                  color: "#2c3e50",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                {topicName}
                                              </div>
                                              <div
                                                style={{
                                                  color: "#34495e",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                {lessonOrder}:{" "}
                                                {
                                                  lessonTitle.replace(
                                                    /^Bài\s*\d+[:\-\s]*/,
                                                    ""
                                                  ) /* bỏ lặp "Bài XX" nếu có */
                                                }
                                                {levelText && (
                                                  <span
                                                    style={{
                                                      marginLeft: "8px",
                                                      padding: "3px 9px",
                                                      background: levelBg,
                                                      color: levelColor,
                                                      borderRadius: "12px",
                                                      fontSize: "14px",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {levelText}
                                                  </span>
                                                )}
                                              </div>
                                              {parentResult.isAIPractice && (
                                                <div
                                                  style={{
                                                    color: "#8e44ad",
                                                    fontSize: "14px",
                                                    marginTop: "3px",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  AI Practice
                                                </div>
                                              )}
                                            </div>
                                          );
                                        } else {
                                          // === CASE 2: BÀI KIỂM TRA ===
                                          const examName =
                                            parentResult.refId?.period ||
                                            parentResult.refId?.name ||
                                            "Kiểm tra";
                                          return (
                                            <span
                                              style={{
                                                color: "#2980b9",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                              }}
                                            >
                                              Kiểm tra {examName}
                                            </span>
                                          );
                                        }
                                      })()}
                                    </td>
                                    <ScrollTextCell
                                      ref={(el) => {
                                        if (!el) return;
                                        const textEl =
                                          el.querySelector(".scroll-text");
                                        if (
                                          textEl &&
                                          textEl.scrollWidth > el.clientWidth
                                        ) {
                                          el.classList.add("overflowed");
                                        } else {
                                          el.classList.remove("overflowed");
                                        }
                                      }}
                                    >
                                      <div className="scroll-text">
                                        {q.text}
                                      </div>
                                    </ScrollTextCell>
                                    <td
                                      style={{
                                        padding: "12px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: "#e74c3c",
                                      }}
                                    >
                                      {q.count}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {q.chosenAnswers.length > 0
                                        ? q.chosenAnswers.join(", ")
                                        : "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "12px",
                                        textAlign: "center",
                                        color: "#2f9d2f",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {q.correctAnswer || "N/A"}
                                    </td>
                                    <td>
                                      {q.count >= 5
                                        ? "⚠️ Rất nguy hiểm"
                                        : q.count >= 3
                                        ? "🟠 Lưu ý"
                                        : "🟡 Sai nhẹ"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <Message style={{ color: "#e74c3c", fontSize: "16px" }}>
                        Chưa có câu nào bị sai nhiều lần
                      </Message>
                    )}
                  </>
                ) : (
                  /* ===== HIỂN THỊ BÌNH THƯỜNG: BIỂU ĐỒ ĐIỂM + BẢNG 10 BÀI ===== */
                  <>
                    <ResponsiveContainer width="100%" height={350}>
                      {chartType === "bar" ? (
                        <BarChart data={recentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-30}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            formatter={(value) => `${value} điểm`}
                            labelFormatter={(label, payload) => {
                              if (payload && payload.length > 0) {
                                const {
                                  date,
                                  subject,
                                  period,
                                  correctAnswers,
                                  totalQuestions,
                                  timeSpent,
                                } = payload[0].payload;
                                return (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      padding: "8px",
                                      background: "white",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <strong>{label}</strong>
                                    <br />
                                    Ngày: {date}
                                    <br />
                                    Môn: {subject}
                                    <br />
                                    Kỳ: {period}
                                    <br />
                                    Đúng: {correctAnswers}/{totalQuestions}
                                    <br />
                                    Thời gian: {timeSpent}
                                  </div>
                                );
                              }
                              return label;
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="score"
                            fill="#2f9d2f"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      ) : (
                        <LineChart data={recentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle="end"
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => `${value} điểm`} />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#2f9d2f"
                            strokeWidth={3}
                            dot={{ fill: "#2f9d2f", r: 6 }}
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>

                    <ResultsTable style={{ marginTop: "25px" }}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Môn học</th>
                          <th>Kỳ thi</th>
                          <th>Điểm số</th>
                          <th>Số câu đúng</th>
                          <th>Thời gian</th>
                          <th>Ngày làm bài</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...filteredExamHistory]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .slice(0, 10)
                          .map((result, idx) => (
                            <tr key={result._id}>
                              <td>{idx + 1}</td>
                              <td>
                                {result.refId?.subjectId?.name ||
                                  result.refId?.topicId?.subjectId?.name ||
                                  "Không rõ"}
                              </td>
                              <td>
                                {result.refType === "Lesson"
                                  ? "Ôn tập"
                                  : result.refId?.period ||
                                    result.refId?.name ||
                                    "Không rõ"}
                              </td>
                              <td>
                                <strong>{result.score}</strong>
                              </td>
                              <td>
                                {result.correctAnswers}/{result.answers.length}
                              </td>
                              <td>
                                {Math.floor(result.timeSpent / 60)} phút{" "}
                                {result.timeSpent % 60} giây
                              </td>
                              <td>{formatDate(result.createdAt)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </ResultsTable>
                  </>
                )}
              </motion.div>
            </>
          )}
        </>
      )}
    </Content>
  );
};

export default ProfileContent;
