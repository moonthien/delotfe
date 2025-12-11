// Updated useLessonLogic.js
import { useState } from "react";
import { useTimer } from "./useTimer";
import {
  getQuestionSet,
  getLessonProgress,
  checkAnswer,
  saveAnswerProgress,
  submitLessonResult,
  getCurrentQuestion,
  resetProgress,
} from "../services/apiService";
import { toast } from "react-toastify";

export const useLessonLogic = ({
  selectedClass,
  selectedSubject,
  activeTopic,
  activeLesson,
  subjectsByGrade,
  topics,
  lessons,
  setLessons,
  questions,
  setQuestions,
  setBreadcrumbParts,
  setUserAnswers,
  setSkippedQuestions,
  setCurrentQuestionIndex,
  setIsChecked,
  setShowVideo,
  setVideoUrl,
  setActiveLesson,
  setSelectedLevel,
  setShowLevelModal,
  setLevelProgresses,
  setLessonToResume,
  setShowResumeModal,
  setIsTransitioning,
  setShowAnswerSelectionModal,
  setShowScoreModal,
  setScore,
  setCorrectAnswers,
  fetchLessonsByTopic,
  selectedLevel,
  levelLabels,
  userAnswers, // Added to parameters explicitly
}) => {
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Gọi useTimer ngay trong logic
  const { timeLeft, setTimeLeft } = useTimer({
    activeLesson: questions.length > 0 ? activeLesson : null,
    activeExam: null,
    selectedLevel,
    questions,
    handleFinish: () => handleFinish(),
    handleFinishExam: null,
  });

  const getEmbedUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/WXd0BHS8eFc";
  
    // Parse video ID từ các dạng URL YouTube (full link, short link, embed)
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  
    // Nếu đã là embed URL thì giữ nguyên
    return url;
  };

  // Xử lý click lý thuyết
  const handleTheoryClick = (lesson) => {
    setVideoUrl(getEmbedUrl(lesson.urlVideo || "https://www.youtube.com/watch?v=WXd0BHS8eFc"));
    setShowVideo(true);
    setActiveLesson(lesson._id);
    setQuestions([]);
    setBreadcrumbParts([
      `Lớp ${selectedClass} - ${
        subjectsByGrade.find((s) => s._id === selectedSubject)?.name || ""
      }`,
      topics.find((t) => t._id === activeTopic)?.title || "",
      lesson.title,
      "Lý thuyết",
    ]);
  };

  // Chọn level
  const handleLevelSelect = async (level, forceRestart = false) => {
    setSelectedLevel(level);
    setIsLoading(true);
    try {
      const studentId = localStorage.getItem("studentId");
      const res = await getQuestionSet(activeLesson, level);
      const allQuestions = res.data.data.questions || res.data.data || [];
      // ❗ Không có câu hỏi
      if (!allQuestions || allQuestions.length === 0) {
        toast.error("Hiện tại chưa có câu hỏi cho mức độ này!", {
          autoClose: 1500,
        });
        setIsLoading(false);
        return;
      }
      // ✔ Có câu hỏi thì tiếp tục logic cũ
      setQuestions(allQuestions);

      if (studentId) {
        const progressRes = await getLessonProgress(activeLesson, studentId);
        const progressData = progressRes.data.data;
        const specificProgress = progressData.details.find((p) => p.level === level);

        if (!forceRestart && specificProgress && specificProgress.status !== "completed") {
          setLessonToResume(lessons.find((l) => l._id === activeLesson));
          setShowResumeModal(true);
        } else {
          await loadQuizFromStart(level);
        }
      } else {
        await loadQuizFromStart(level);
      }
    } catch (err) {
      // ❗ Khi API trả 404 hoặc lỗi tương tự
      toast.error("Chưa có dữ liệu cho mức độ này!", {
        autoClose: 1500,
      });
      console.error("❌ Lỗi load câu hỏi:", err);
    } finally {
      setIsLoading(false);
      setShowLevelModal(false);
    }
  };

  // Load quiz từ đầu
  const loadQuizFromStart = async (level) => {
    setIsLoading(true);
    try {
      const qsRes = await getQuestionSet(activeLesson, level);
      const allQuestions = qsRes.data.data.questions || qsRes.data.data || [];
      setQuestions(allQuestions);
      setUserAnswers({});
      setSkippedQuestions(new Set());
      setCurrentQuestionIndex(0);
      setIsChecked(false);

      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName = subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      const topicName = topics.find((t) => t._id === activeTopic)?.title || "";
      const lessonName = lessons.find((l) => l._id === activeLesson)?.title || "";
      const levelLabel = levelLabels[level] || level;
      setBreadcrumbParts([`${className} - ${subjectName}`, topicName, lessonName, levelLabel]);
    } catch (err) {
      console.error("❌ Lỗi load quiz từ đầu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý click lesson
  const handleLessonClick = async (lesson) => {
    setActiveLesson(lesson._id);
    setTimeLeft(0);
    setIsLoading(true);

    try {
      const studentId = localStorage.getItem("studentId");
      let progressData = { details: [] };

      if (studentId) {
        const res = await getLessonProgress(lesson._id, studentId);
        progressData = res.data.data;
      }

      const levels = ["de", "trungbinh", "nangcao"];
      const levelInfos = {};

      await Promise.all(
        levels.map(async (lvl) => {
          try {
            const qsRes = await getQuestionSet(lesson._id, lvl);
            const total = qsRes?.data?.data?.questions?.length || 0;

            const spec = progressData.details.find((p) => p.level === lvl);
            let perc = 0;

            if (spec && total > 0) {
              if (spec.status === "completed") {
                perc = 100;
              } else if (spec.answers && spec.answers.length > 0) {
                perc = Math.round((spec.answers.length / total) * 100);
              }
            }

            levelInfos[lvl] = perc;
          } catch (err) {
            console.error(`Lỗi fetch data cho level ${lvl}:`, err);
            levelInfos[lvl] = 0;
          }
        })
      );

      setLevelProgresses(levelInfos);
      setShowLevelModal(true);
    } catch (err) {
      console.error("❌ Lỗi khi chuẩn bị modal:", err);
      setShowLevelModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Resume quiz
  const handleResumeQuiz = async (lesson) => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    setIsLoading(true);
    try {
      const res = await getCurrentQuestion(studentId, "Lesson", lesson._id, selectedLevel);
      const { currentQuestion } = res.data.data;
      const qsRes = await getQuestionSet(lesson._id, selectedLevel);
      const allQuestions = qsRes.data.data.questions || qsRes.data.data || [];
      setQuestions(allQuestions);

      const progressRes = await getLessonProgress(lesson._id, studentId);
      const progressData = progressRes.data.data;
      const specificProgress = progressData.details.find((p) => p.level === selectedLevel);

      const savedAnswers = {};
      let correctCount = 0;
      if (specificProgress && specificProgress.answers) {
        specificProgress.answers.forEach((answer) => {
          savedAnswers[answer.questionId] = {
            selected: answer.selected,
            isCorrect: answer.isCorrect,
            correctAnswer: answer.correctAnswer,
            correctAnswerText: answer.correctAnswerText,
          };
          if (answer.isCorrect) correctCount++;
        });
      }
      setUserAnswers(savedAnswers);

      // Load lại điểm số từ DB
      const total = allQuestions.length;
      const savedScore = specificProgress?.score ??
                      (total > 0 ? Math.round((correctCount / total) * 100) : 0);
      setScore(savedScore); // ← Cập nhật điểm ngay khi resume

      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName = subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      const topicName = topics.find((t) => t._id === activeTopic)?.title || "";
      const lessonName = lessons.find((l) => l._id === lesson._id)?.title || lesson.title || "";
      const levelLabel = levelLabels[selectedLevel] || selectedLevel;
      setBreadcrumbParts([`${className} - ${subjectName}`, topicName, lessonName, levelLabel]);

      let idx = allQuestions.findIndex((q) => q._id === currentQuestion._id);
      if (idx === -1) idx = 0;
      setCurrentQuestionIndex(idx);
      setShowResumeModal(false);

      // const savedTime = localStorage.getItem("lessonTimeLeft");
      // if (savedTime && !isNaN(savedTime)) {
      //   console.log("⏱️ Khôi phục thời gian còn lại:", savedTime, "giây");
      //   setTimeLeft(parseInt(savedTime, 10));
      // } else {
      //   setTimeLeft(2400);
      // }
      const timeSpentFromDB = specificProgress?.timeSpent || 0;
      setTimeLeft(timeSpentFromDB);
      localStorage.setItem("lessonTimeLeft", timeSpentFromDB.toString());
    } catch (err) {
      console.error("❌ Lỗi khi tiếp tục:", err.response?.data || err.message);
      setShowResumeModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Kết thúc lesson
  const handleFinish = async () => {
    if (hasSubmitted) return; // Đã nộp thì không mở lại modal
    setShowSubmitConfirmModal(true);
  };

  // Xác nhận nộp bài cho lesson
  const handleConfirmSubmitLesson = async () => {
    setIsTransitioning(true);
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId || !activeLesson) return;

      const totalQuestions = questions.length;
      let correctCount = 0;
      const timeSpent = timeLeft;

      const safeUserAnswers = userAnswers || {};
      const answers = await Promise.all(
        questions.map(async (q) => {  // Loop qua tất cả questions thay vì chỉ userAnswers
          const questionId = q._id;
          const answer = safeUserAnswers[questionId] || {};  // Nếu chưa có, tạo object rỗng
          let isCorrect = false;
          let selected = answer.selected || "";  // Nếu chưa chọn, selected = ""

          if (selected) {
            try {
              const res = await checkAnswer(questionId, selected);
              isCorrect = res.data.data.isCorrect;
              setUserAnswers((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  isCorrect,
                  correctAnswer: res.data.data.correctAnswer,
                  correctAnswerText: res.data.data.correctAnswerText,
                },
              }));
            } catch (err) {
              console.warn(`⚠️ Lỗi checkAnswer cho câu ${questionId}`, err);
            }
          } // Nếu không có selected, isCorrect vẫn là false (như sai)

          if (isCorrect) correctCount += 1;
          return { questionId, selected, isCorrect };
        })
      );

      const calculatedScore =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

      setScore(calculatedScore);
      setCorrectAnswers(correctCount);

      console.log("📤 Submit lesson result:", { studentId, activeLesson, answers, timeSpent, selectedLevel });
      await submitLessonResult(studentId, activeLesson, answers, timeSpent, selectedLevel);
      await saveAnswerProgress(studentId, {
        refType: "Lesson",
        refId: activeLesson,
        level: selectedLevel,
        status: "completed",
        timeSpent,
        answers, // Include answers for progress collection
        correctAnswers: correctCount,
        totalQuestions,
        score: calculatedScore,
      });

      localStorage.removeItem("lessonTimeLeft");
      setHasSubmitted(true);
      setShowSubmitConfirmModal(false);
      setShowScoreModal(true);
    } catch (err) {
      console.error("❌ Lỗi khi xác nhận nộp bài:", err);
      setHasSubmitted(true);
      setShowSubmitConfirmModal(false);
      setShowScoreModal(true);
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
    handleTheoryClick,
    handleLevelSelect,
    handleLessonClick,
    handleResumeQuiz,
    handleFinish,
    handleConfirmSubmitLesson,
    showSubmitConfirmModal,
    setShowSubmitConfirmModal,
    timeLeft,
    setTimeLeft,
    isLoading,
    setIsLoading,
  };
};