import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  submitExamResult,
  getQuestionsByExam,
} from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  GlobalStyle,
  PageContainer,
  ExamTitle,
  QuestionCard,
  QuestionText,
  QuestionLabel,
  ImageContainer,
  QuestionImage,
  OptionsList,
  OptionItem,
  InputAnswer,
  NavigationContainer,
  ActionButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
  ModalButtonContainer,
  ReviewText,
  ScoreText,
  TimeText,
  InputContainer,
  PlaceholderDiv,
  QuestionIndicators,
  QuestionIndicator,
  WarningModalText,
  QuestionProgress,
  QuestionProgressClock,
} from "./styles/ExamQuestionPage.styles";
import clockIcon from "../assets/clockicon.png";

function ExamQuestionPage() {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút
  const [timeSpent, setTimeSpent] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const timerRef = useRef(null);
  const isSubmittingRef = useRef(false); // Lock to prevent duplicate submissions

  // ✅ Lấy studentId đúng từ localStorage
  const student = JSON.parse(localStorage.getItem("selectedStudent")) || {};
  const studentId = student._id || student.id || null;
  const progressKey = `examProgress_${studentId || "default"}_${examId}`;

  // Hàm định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Chuyển nhanh câu hỏi
  const handleQuestionClick = (index) => {
    if (examCompleted) return;
    setCurrentQuestionIndex(index);
  };

  // Load câu hỏi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByExam(examId);
        const sets = res.data.data || [];
        const allQuestions = sets.flatMap((set) => set.questions || []);
        setQuestions(allQuestions);

        const storedProgress = localStorage.getItem(progressKey);
        if (storedProgress) {
          const progress = JSON.parse(storedProgress);
          const now = Date.now();
          const elapsed = Math.floor((now - progress.lastSaved) / 1000);
          let newTimeLeft = progress.timeLeft - elapsed;
          let newTimeSpent = progress.timeSpent + elapsed;

          if (newTimeLeft <= 0) {
            setTimeLeft(0);
            setTimeSpent(600);
            if (!examCompleted && !isSubmittingRef.current) {
              handleFinish(true);
            }
            return;
          }

          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setUserAnswers(progress.userAnswers || {});
          setTimeLeft(newTimeLeft);
          setTimeSpent(newTimeSpent);
          setExamStarted(true);
        } else if (location.state?.startExam) {
          setExamStarted(true);
          setTimeLeft(600);
          setTimeSpent(0);
        }
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId, location.state, progressKey, examCompleted]);

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!examCompleted && !isSubmittingRef.current) {
            handleFinish(true);
          }
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [examStarted, examCompleted]);

  // Lưu progress vào localStorage
  useEffect(() => {
    if (!examStarted || examCompleted) return;
    const progress = {
      examId,
      currentQuestionIndex,
      userAnswers,
      timeLeft,
      timeSpent,
      examStarted,
      lastSaved: Date.now(),
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [examStarted, currentQuestionIndex, userAnswers, timeLeft, timeSpent, examId, progressKey]);

  const handleAnswerClick = (questionId, optionKey) => {
    if (examCompleted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: optionKey },
    }));
  };

  const handleInputChange = (questionId, value) => {
    if (examCompleted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: value },
    }));
  };

  // ✅ Hàm nộp bài
  const handleFinish = async (auto = false) => {
    if (examCompleted || isSubmittingRef.current) return; // Ngăn chặn gọi nhiều lần
    isSubmittingRef.current = true; // Khóa ngay lập tức

    try {
      if (!auto) {
        const skipped = questions
          .map((q, index) => (!userAnswers[q._id]?.selected ? index + 1 : null))
          .filter((num) => num !== null);

        if (skipped.length > 0 && !showWarningModal) {
          setSkippedQuestions(skipped);
          setShowWarningModal(true);
          isSubmittingRef.current = false; // Mở khóa nếu hiển thị modal
          return;
        }
      }

      // Tính điểm (frontend hiển thị)
      let correctAnswers = 0;
      const updatedAnswers = { ...userAnswers };

      questions.forEach((q) => {
        const userAns = updatedAnswers[q._id]?.selected || "";
        const isCorrect =
          userAns.trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase();

        if (isCorrect) correctAnswers++;

        updatedAnswers[q._id] = {
          ...updatedAnswers[q._id],
          isCorrect,
        };
      });

      let total = 0;
      if (questions.length > 0) {
        total = Math.round((correctAnswers / questions.length) * 100);
      }
      setScore(total);
      setExamCompleted(true);
      setShowCompleteModal(true);
      clearInterval(timerRef.current);

      if (studentId) {
        // Chỉ gửi questionId + selected
        const answersArray = Object.entries(updatedAnswers).map(([qid, ans]) => ({
          questionId: qid,
          selected: ans.selected,
          isCorrect: ans.isCorrect,
        }));

        const finalTime = auto ? 600 : timeSpent;

        console.log("📤 Submitting result:", {
          studentId,
          examId,
          answersArray,
          timeSpent: finalTime,
        });

        await submitExamResult(studentId, examId, answersArray, finalTime);

        console.log("✅ Kết quả đã gửi lên server");
      } else {
        console.warn("⚠️ studentId không tồn tại, không thể submit");
      }

      localStorage.removeItem(progressKey);
    } catch (err) {
      console.error("❌ Nộp kết quả thất bại:", err.response?.data || err.message);
    } finally {
      isSubmittingRef.current = false; // Mở khóa sau khi hoàn tất
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) return <ReviewText>Đang tải câu hỏi...</ReviewText>;
  const q = questions[currentQuestionIndex];
  const userAnswer = userAnswers[q?._id];

  return (
    <>
      <GlobalStyle />
      <Header />
      <PageContainer>
        <ExamTitle>KIỂM TRA GIỮA KỲ 1 - TOÁN LỚP 3</ExamTitle>

        {showCompleteModal ? (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>🎉 Bạn đã hoàn thành bài kiểm tra!</ModalTitle>
              <ModalText>
                Điểm số của bạn: <strong>{score}</strong>
              </ModalText>
              <TimeText>⏱️ Thời gian làm: {formatTime(timeSpent)}</TimeText>
              <ActionButton bgColor="green" onClick={() => navigate(-1)}>
                Quay lại
              </ActionButton>
            </ModalContent>
          </ModalOverlay>
        ) : questions.length === 0 ? (
          <ReviewText>Chưa có câu hỏi nào</ReviewText>
        ) : (
          <>
            <QuestionIndicators>
              {questions.map((qItem, i) => {
                const qId = qItem._id;
                const answered = !!userAnswers[qId]?.selected;
                let status =
                  i === currentQuestionIndex
                    ? "current"
                    : answered
                    ? "done"
                    : "pending";
                return (
                  <QuestionIndicator
                    key={i}
                    status={status}
                    onClick={() => handleQuestionClick(i)}
                    clickable={!examCompleted}
                  >
                    {i + 1}
                  </QuestionIndicator>
                );
              })}
            </QuestionIndicators>

            <div style={{ position: "relative" }}>
              <QuestionProgress>
                Câu {currentQuestionIndex + 1}/{questions.length}
              </QuestionProgress>
              <QuestionProgressClock>
                <img src={clockIcon} alt="clock" className="clock-icon" />
                {formatTime(timeLeft)}
                <img src={clockIcon} alt="clock" className="clock-icon" />
              </QuestionProgressClock>
              <QuestionCard>
                <QuestionText>
                  <QuestionLabel>Câu {currentQuestionIndex + 1}:</QuestionLabel>
                  {q.questionText}
                </QuestionText>

                {q.image && (
                  <ImageContainer>
                    <QuestionImage src={q.image} alt="question" />
                  </ImageContainer>
                )}

                {q.options ? (
                  <OptionsList>
                    {Object.entries(q.options).map(([key, value]) => (
                      <OptionItem
                        key={key}
                        onClick={() => handleAnswerClick(q._id, key)}
                        isSelected={userAnswer?.selected === key}
                        disabled={examCompleted}
                      >
                        {key}. {value}
                      </OptionItem>
                    ))}
                  </OptionsList>
                ) : (
                  <InputContainer>
                    <InputAnswer
                      type="text"
                      placeholder="Nhập đáp án..."
                      value={userAnswer?.selected || ""}
                      onChange={(e) => handleInputChange(q._id, e.target.value)}
                      disabled={examCompleted}
                    />
                  </InputContainer>
                )}

                <NavigationContainer>
                  {currentQuestionIndex > 0 ? (
                    <ActionButton bgColor="#6c757d" onClick={handlePrev}>
                      Câu trước
                    </ActionButton>
                  ) : (
                    <PlaceholderDiv />
                  )}

                  {currentQuestionIndex < questions.length - 1 ? (
                    <ActionButton onClick={handleNext}>Câu tiếp</ActionButton>
                  ) : (
                    !examCompleted && (
                      <ActionButton
                        bgColor="green"
                        onClick={() => handleFinish(false)}
                      >
                        Nộp bài
                      </ActionButton>
                    )
                  )}
                </NavigationContainer>
              </QuestionCard>
            </div>

            {showWarningModal && (
              <ModalOverlay zIndex={2000}>
                <ModalContent>
                  <ModalTitle>Bạn có chắc muốn nộp bài?</ModalTitle>
                  <WarningModalText>
                    Bạn chưa hoàn thành các câu: {skippedQuestions.join(", ")}
                  </WarningModalText>
                  <ModalButtonContainer>
                    <ActionButton
                      bgColor="green"
                      onClick={() => {
                        setShowWarningModal(false);
                        handleFinish(true);
                      }}
                    >
                      Xác nhận nộp
                    </ActionButton>
                    <ActionButton
                      bgColor="red"
                      onClick={() => setShowWarningModal(false)}
                    >
                      Quay lại làm bài
                    </ActionButton>
                  </ModalButtonContainer>
                </ModalContent>
              </ModalOverlay>
            )}
          </>
        )}
      </PageContainer>
      <Footer />
    </>
  );
}

export default ExamQuestionPage;