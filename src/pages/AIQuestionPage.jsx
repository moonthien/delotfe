import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  QuestionIndicators,
  QuestionIndicator,
  QuestionProgress,
  QuestionProgressClock,
  PlaceholderDiv,
  clockIcon,
  LoadingOverlay,
  ExamSubtitle,
  AILoadingWrapper,
  AILoadingText,
  PencilContainer,
  ScoreModalOverlay,
  ScoreModalContent,
  ScoreModalTitle,
  ScoreModalDescription,
  ScoreModalButton,
} from "../pages/styles/AIQuestionPage.styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  generatePractice,
  getPracticeById,
  submitPracticeResult,
} from "../services/apiService";

const AIQuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isExamAI = false,
    lessonId,
    lessonTitle,
    examId,
    examTitle,
    level = "de",
    questions: passedQuestions = [],
    practiceSessionId = null,
  } = location.state || {};
  const effectiveLessonId = lessonId || "689ab7af3f4fc490a4bad12b";
  const [questions, setQuestions] = useState(passedQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [practiceSession, setPracticeSession] = useState(practiceSessionId);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreData, setScoreData] = useState({ score: 0, total: 0, correct: 0 });

  // 🕒 Đồng hồ tăng dần 0 → 10:00
  useEffect(() => {
    if (!timerActive) return;
    let elapsed = 0;
    setTimeSpent(elapsed);
    const interval = setInterval(() => {
      elapsed += 1;
      setTimeSpent(elapsed);
      if (elapsed >= 600) { // 10 phút
        clearInterval(interval);
        setTimerActive(false);
        handleSubmit(); // ⏰ tự động nộp bài khi hết giờ
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Load đề AI: nếu là Exam AI thì dùng câu hỏi có sẵn, nếu là Lesson AI thì gọi generatePractice
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        if (isExamAI) {
          // ✅ Exam AI: dùng luôn danh sách câu hỏi được truyền sang
          setQuestions(passedQuestions);
          setPracticeSession(practiceSessionId);
        } else {
          // ✅ Lesson AI: dùng API generatePractice
          let session = practiceSessionId;
          let res;
          if (!session) {
            res = await generatePractice(effectiveLessonId, level);
            session = res.data.data.practiceSessionId;
            setPracticeSession(session);
          } else {
            res = await getPracticeById(session);
          }
          setQuestions(res.data.data.questions);
        }
      } catch (error) {
        console.error("Lỗi load practice:", error);
        alert("Không thể tải câu hỏi. Vui lòng thử lại.");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadQuestions();
  }, []);

  // Chọn đáp án
  const handleSelect = (questionId, selected) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  };

  // Next / Previous
  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        alert("Không tìm thấy học sinh. Vui lòng chọn học sinh.");
        return;
      }

      const formattedAnswers = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selected,
      }));

      const timeUsed = timeSpent;

      const res = await submitPracticeResult(practiceSessionId,formattedAnswers,studentId,timeUsed);

      const correct = res.data.data.correctAnswers;
      const total = res.data.data.totalQuestions;
      const percentage = Math.round((correct / total) * 100);
      setScoreData({
        score: percentage,
        total: 100,
        correct,
      });
      setShowScoreModal(true);
      setTimerActive(false);
    } catch (error) {
      console.error("Lỗi submitPracticeResult:", error);
      alert("Nộp bài thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
  return (
    <AILoadingWrapper>
      <PencilContainer>
        <svg className="pencil" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="pencil-eraser">
              <rect rx="5" ry="5" width="30" height="30"></rect>
            </clipPath>
          </defs>
          <circle
            className="pencil__stroke"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="439.82 439.82"
            strokeDashoffset="439.82"
            strokeLinecap="round"
            transform="rotate(-113,100,100)"
          />
          <g className="pencil__rotate" transform="translate(100,100)">
            <g fill="none">
              <circle className="pencil__body1" r="64" stroke="hsl(223,90%,50%)" strokeWidth="30"
                strokeDasharray="402.12 402.12" strokeDashoffset="402" transform="rotate(-90)" />
              <circle className="pencil__body2" r="74" stroke="hsl(223,90%,60%)" strokeWidth="10"
                strokeDasharray="464.96 464.96" strokeDashoffset="465" transform="rotate(-90)" />
              <circle className="pencil__body3" r="54" stroke="hsl(223,90%,40%)" strokeWidth="10"
                strokeDasharray="339.29 339.29" strokeDashoffset="339" transform="rotate(-90)" />
            </g>
            <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
              <g className="pencil__eraser-skew">
                <rect fill="hsl(223,90%,70%)" rx="5" ry="5" width="30" height="30" />
                <rect fill="hsl(223,90%,60%)" width="5" height="30" clipPath="url(#pencil-eraser)" />
                <rect fill="hsl(223,10%,90%)" width="30" height="20" />
                <rect fill="hsl(223,10%,70%)" width="15" height="20" />
                <rect fill="hsl(223,10%,80%)" width="5" height="20" />
                <rect fill="hsla(223,10%,10%,0.2)" y="6" width="30" height="2" />
                <rect fill="hsla(223,10%,10%,0.2)" y="13" width="30" height="2" />
              </g>
            </g>
            <g className="pencil__point" transform="rotate(-90) translate(49,-30)">
              <polygon fill="hsl(33,90%,70%)" points="15 0,30 30,0 30" />
              <polygon fill="hsl(33,90%,50%)" points="15 0,6 30,0 30" />
              <polygon fill="hsl(223,10%,10%)" points="15 0,20 10,10 10" />
            </g>
          </g>
        </svg>
      </PencilContainer>
      <AILoadingText>Đang tải đề ôn tập AI...</AILoadingText>
    </AILoadingWrapper>
  );
}


  if (!questions || questions.length === 0) return null;
  const q = questions[currentIdx];
  const totalQuestions = questions.length;
  const selectedAnswer = answers[q.id] || "";

  return (
    <>
      <GlobalStyle />
      <Header />

      <PageContainer>
        {isExamAI ? (
          <>
            <ExamTitle>{examTitle} - Đề AI 🤖</ExamTitle>
          </>
        ) : (
          <>
            <ExamTitle>ĐỀ ÔN TẬP - TẠO BỞI AI 🤖</ExamTitle>
            <ExamSubtitle>
              Mức độ: {level === "de" ? "Dễ" : level === "trungbinh" ? "Trung bình" : "Nâng cao"}
            </ExamSubtitle>
          </>
        )}
        <QuestionIndicators>
          {questions.map((_, i) => (
            <QuestionIndicator
              key={i}
              status={i === currentIdx ? "current" : answers[questions[i].id] ? "done" : "pending"}
            >
              {i + 1}
            </QuestionIndicator>
          ))}
        </QuestionIndicators>

        <div style={{ position: "relative" }}>
          <QuestionProgress>
            Câu {currentIdx + 1}/{totalQuestions}
          </QuestionProgress>
          <QuestionProgressClock>
            <img src={clockIcon} alt="clock" className="clock-icon" />
            {`${String(Math.floor(timeSpent / 60)).padStart(2, "0")}:${String(timeSpent % 60).padStart(2, "0")}`}
          </QuestionProgressClock>

          <QuestionCard>
            <QuestionText>
              <QuestionLabel>Câu {currentIdx + 1}:</QuestionLabel>
              {q.questionText}
            </QuestionText>

            {q.options ? (
              <OptionsList>
                {Object.entries(q.options).map(([key, value]) => (
                  <OptionItem
                    key={key}
                    isSelected={selectedAnswer === key}
                    bgColor={selectedAnswer === key ? "#007bff" : "#fff"}
                    textColor={selectedAnswer === key ? "#fff" : "#000"}
                    onClick={() => handleSelect(q.id, key)}
                  >
                    {key}. {value}
                  </OptionItem>
                ))}
              </OptionsList>
            ) : (
              <InputAnswer
                type="text"
                placeholder="Nhập đáp án..."
                value={selectedAnswer}
                onChange={(e) => handleSelect(q.id, e.target.value)}
              />
            )}

            <NavigationContainer>
              {currentIdx > 0 ? (
                <ActionButton bgColor="#6c757d" onClick={handlePrev}>
                  Câu trước
                </ActionButton>
              ) : (
                <PlaceholderDiv />
              )}

              {currentIdx < totalQuestions - 1 ? (
                <ActionButton onClick={handleNext}>Câu tiếp</ActionButton>
              ) : (
                <ActionButton bgColor="green" onClick={handleSubmit}>
                  Nộp bài
                </ActionButton>
              )}
            </NavigationContainer>
          </QuestionCard>
        </div>
      </PageContainer>

      {showScoreModal && (
        <ScoreModalOverlay>
          <ScoreModalContent>
            <ScoreModalTitle>🎉 Nộp bài thành công!</ScoreModalTitle>
            <ScoreModalDescription>
              Điểm: {scoreData.score}/{scoreData.total}
              <br />
              Số câu đúng: {scoreData.correct}
            </ScoreModalDescription>
            <ScoreModalButton onClick={() => { setShowScoreModal(false); navigate("/toan");}}>Đóng</ScoreModalButton>
          </ScoreModalContent>
        </ScoreModalOverlay>
      )}
      <Footer />
    </>
  );
};

export default AIQuestionPage;
