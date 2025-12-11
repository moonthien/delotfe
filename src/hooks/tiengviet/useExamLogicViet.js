// Updated useExamLogic.js
import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer"; // ✅ import hook timer
import {
  getExamsBySubject,
  getQuestionsByExam,
  getExamProgress,
  checkAnswer,
  submitExamResult,
  saveAnswerProgress,
  getCurrentQuestion,
} from "../../services/apiService";

export const useExamLogicViet = ({
  selectedSubject,
  selectedClass,
  subjectsByGrade,
  topics,
  setQuestions,
  setBreadcrumbParts,
  setUserAnswers,
  setSkippedQuestions,
  setCurrentQuestionIndex,
  setIsChecked,
  setShowVideo,
  setShowLevelModal,
  setShowResumeModal,
  setLessonToResume,
  setIsTransitioning,
  setShowAnswerSelectionModal,
  setShowScoreModal,
  setScore,
  setCorrectAnswers,
  questions,
}) => {
  const [exams, setExams] = useState([]);
  const [activeExamTopic, setActiveExamTopic] = useState(null);
  const [topicExams, setTopicExams] = useState([]);
  const [activeExam, setActiveExam] = useState("");
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [textPassage, setTextPassage] = useState("");

  // 🕒 Gọi useTimer ngay trong logic
  const { timeLeft, setTimeLeft } = useTimer({
    activeLesson: null,
    activeExam,
    selectedLevel: null,
    questions,
    handleFinish: null,
    handleFinishExam: () => handleFinishExam(), // gọi khi hết giờ
  });

  // 🧠 Lấy danh sách exam theo môn học
  useEffect(() => {
    if (selectedSubject) {
      getExamsBySubject(selectedSubject)
        .then((res) => setExams(res.data.data || []))
        .catch((err) => console.error("❌ Lỗi fetch exams:", err));
    } else {
      setExams([]);
    }
  }, [selectedSubject]);

  // 📘 Xử lý click chọn kỳ thi
  const handleExamClick = async (exam, forceRestart = false) => {
    setActiveExam(exam._id);
    setQuestions([]);
    setBreadcrumbParts([]);
    setUserAnswers({});
    setSkippedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setIsChecked(false);
    setShowVideo(false);
    setShowLevelModal(false);
    setShowResumeModal(false);
    setLessonToResume(null);
    setIsTransitioning(false);
    setShowAnswerSelectionModal(false);
    setShowScoreModal(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(2400);
    setIsLoading(true);
    setTextPassage("");

    try {
      const studentId = localStorage.getItem("studentId");
      const qsRes = await getQuestionsByExam(exam._id);
      
      const examData = qsRes.data.data[0] || {};
      const allQuestions = examData.questions || [];
      setQuestions(allQuestions);
      setTextPassage(examData.textPassage || "");

      if (studentId) {
        const res = await getExamProgress(exam._id, studentId);
        const progressData = res.data.data;

        if (
          !forceRestart && // ✅ bỏ qua resume modal nếu đang "làm lại từ đầu"
          progressData &&
          progressData.details?.length > 0
        ) {
          const examProgress = progressData.details.find(
            (p) => p.status === "in_progress"
          );
          if (examProgress) {
            setLessonToResume(exam);
            setShowResumeModal(true);
            return;
          }
        }
      }

      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName =
        subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      const examName = exam.period;
      setBreadcrumbParts([
        `${className} - ${subjectName}`,
        "Kiểm tra",
        examName,
      ]);
    } catch (err) {
      console.error("❌ Lỗi khi load bài kiểm tra:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Bắt đầu bài kiểm tra mới
  const handleStartExam = async (exam) => {
    try {
      setActiveExam(exam._id);
      setIsLoading(true);

      const qsRes = await getQuestionsByExam(exam._id);
      const examData = qsRes.data.data[0] || {};
      const allQuestions = examData.questions || [];
      setQuestions(allQuestions);
      setTextPassage(examData.textPassage || "");
      setUserAnswers({});
      setSkippedQuestions(new Set());
      setCurrentQuestionIndex(0);
      setIsChecked(false);
      setTimeLeft(2400);

      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName =
        subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      setBreadcrumbParts([
        `${className} - ${subjectName}`,
        "Kiểm tra",
        exam.period,
      ]);
    } catch (err) {
      console.error("❌ Lỗi khi bắt đầu bài kiểm tra:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resume exam
  const handleResumeExam = async (exam) => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    setIsLoading(true);
    try {
      const res = await getCurrentQuestion(studentId, "Exam", exam._id, "");
      const { currentQuestion } = res.data.data;

      const qsRes = await getQuestionsByExam(exam._id);
      const examData = qsRes.data.data[0] || {};
      const allQuestions = examData.questions || [];
      setQuestions(allQuestions);
      setTextPassage(examData.textPassage || "");

      const progressRes = await getExamProgress(exam._id, studentId);
      const progressData = progressRes.data.data;
      const spec = progressData?.details?.[0];

      const savedAnswers = {};
      if (spec && spec.answers) {
        spec.answers.forEach((answer) => {
          const qId = answer.questionId?.toString();
          if (!qId) return;
          savedAnswers[qId] = {
            selected: answer.selected,
            isCorrect: answer.isCorrect,
            correctAnswer: answer.correctAnswer,
            correctAnswerText: answer.correctAnswerText,
          };
        });
      }

      setUserAnswers(savedAnswers);
      setIsChecked(true);

      let idx = allQuestions.findIndex((q) => q._id === currentQuestion._id);
      if (idx === -1) idx = 0;
      setCurrentQuestionIndex(idx);

      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName =
        subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      const examName = exam.period;
      setBreadcrumbParts([`${className} - ${subjectName}`, "Kiểm tra", examName]);
      setShowResumeModal(false);

      // const savedTime = localStorage.getItem("examTimeLeft");
      // if (savedTime && !isNaN(savedTime)) {
      //   console.log("⏱️ Khôi phục thời gian còn lại:", savedTime, "giây");
      //   setTimeLeft(parseInt(savedTime, 10));
      // } else {
      //   setTimeLeft(2400);
      // }
      const timeSpentFromDB = spec?.timeSpent || 0;
      const countdown = Math.max(2400 - timeSpentFromDB, 0);
      setTimeLeft(countdown);
      localStorage.setItem("examTimeLeft", countdown.toString());

    } catch (err) {
      console.error("❌ Lỗi khi tiếp tục bài kiểm tra:", err.response?.data || err.message);
      setShowResumeModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Kết thúc exam
  const handleFinishExam = async () => {
    setShowSubmitConfirmModal(true);
  };

  const handleConfirmSubmitExam = async (questions, userAnswers) => {
  // 🔒 Gắn cờ để timer không gọi lại handleFinishExam
  window.__examHasSubmitted = true;

  // 🧹 Dừng toàn bộ timer nếu còn chạy
  if (window.__examTimerRef) {
    clearInterval(window.__examTimerRef);
    window.__examTimerRef = null;
  }

  setIsTransitioning(true);

  try {
    setHasSubmitted(true);

    const studentId = localStorage.getItem("studentId");
    if (!studentId || !activeExam) return;

    const totalQuestions = questions.length;
    const timeSpent = 2400 - timeLeft;

    // 🔹 Tính số câu đúng (nếu có câu hỏi)
    const answers = await Promise.all(
      questions.map(async (q) => {  
        const answer = userAnswers[q._id] || {};
        let isCorrect = false;
        let selected = answer.selected || "";

        if (selected) {
          try {
            const res = await checkAnswer(q._id, selected);
            isCorrect = res.data.data.isCorrect;
          } catch (err) {
            console.warn(`⚠️Lỗi checkAnswer câu ${q._id}`, err);
          }
        }

        return { questionId: q._id, selected, isCorrect };
      })
    );

    const correctCount = answers.filter(a => a.isCorrect).length;
    const calculatedScore =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    setScore(calculatedScore);
    setCorrectAnswers(correctCount);

    // 1. Nộp kết quả chính (results collection)
    await submitExamResult(studentId, activeExam, answers, timeSpent);

    // 2. Cập nhật progress 
    await saveAnswerProgress(studentId, {
      refType: "Exam",
      refId: activeExam,
      status: "completed",
      timeSpent,
      answers,
      correctAnswers: correctCount,
      totalQuestions,
      score: calculatedScore,
    });

    // 🧩 Sau khi nộp bài thành công → cộng hạt dẻ (nếu đạt 100%)
    try {
      const selectedStudent = JSON.parse(localStorage.getItem("selectedStudent"));
      const examsRes = await getExamsBySubject(selectedSubject);
      const examInfo = examsRes?.data?.data?.find((e) => e._id === activeExam);

      const rewardNuts = examInfo?.rewardNuts || 0;
      if (rewardNuts > 0 && calculatedScore === 100) {
        const newNuts = (selectedStudent?.nuts || 0) + rewardNuts;
        const updatedStudent = { ...selectedStudent, nuts: newNuts };

        localStorage.setItem("selectedStudent", JSON.stringify(updatedStudent));
        window.dispatchEvent(new Event("studentUpdated"));
        console.log(`🎉 Đạt điểm tối đa! +${rewardNuts} 🌰`);
      }
    } catch (e) {
      console.warn("⚠️ Không thể cộng hạt dẻ:", e);
    }

    // ✅ Dọn dẹp sau khi nộp bài
    localStorage.removeItem("examTimeLeft");
    setShowSubmitConfirmModal(false); // Đóng modal xác nhận
    setShowScoreModal(true);
  } catch (err) {
    console.error("❌ Lỗi khi xác nhận nộp bài:", err);
  } finally {
    setIsTransitioning(false);
  }
};


  return {
    exams,
    activeExam,
    setActiveExam,
    activeExamTopic,
    topicExams,
    showSubmitConfirmModal,
    isLoading,
    setIsLoading,
    handleExamClick,
    handleStartExam,
    handleFinishExam,
    handleResumeExam,
    handleConfirmSubmitExam,
    setShowSubmitConfirmModal,
    timeLeft, // ✅ thêm để MathPage hiển thị
    setTimeLeft,
    textPassage, // ✅ xuất textPassage ra ngoài
    setTextPassage,
  };
};