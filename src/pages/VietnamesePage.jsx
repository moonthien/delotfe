import React, { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  GlobalStyle,
  Sidebar,
  TopicItem,
  TopicTitle,
  ExamTitle,
  ContentWrapper,
  MainContent,
  SearchBox,
  SearchInput,
  SearchIcon,
  LoadingSpinner,
  LessonCard,
  LessonContent,
  LessonTitle,
  LessonGrid,
  LessonImageContainer,
  LessonImage,
  LessonIcons,
  IconItem,
  TheoryIcon,
  IconLabel,
  NutsTooltip,
  NutsWrapper,
  NutsText,
  NutsIcon,
  TimerContainer,
  TimerBox,
  QuestionLayoutWrapper,
  QuestionSquaresColumn,
  QuestionLayout,
  QuestionSidebar,
  QuestionSquaresContainer,
  QuestionSquare,
  SubmitButton,
} from "./styles/MonHocPage.styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  checkAnswer,
  getLessonProgress,
  getExamProgress,
  saveAnswerProgress,
  getCurrentQuestion,
  resetProgress,
  getQuestionSet,
  submitLessonResult,
  getExamsBySubject,
  getQuestionsByExam,
  submitExamResult,
  generatePractice,
  generateExamPractice,
  getStudentById,
} from "../services/apiService";
import ReactPlayer from "react-player";
import { useVietnameseApi } from "../hooks/useVietnameseApi";
import { useExamLogicViet } from "../hooks/tiengviet/useExamLogicViet";
import { useLessonLogicViet } from "../hooks/tiengviet/useLessonLogicViet";
import { MathSectionComponent, LessonGridComponent, QuestionComponent, BreadcrumbComponent, VideoComponent,} from "../components/monhoc/LayoutTiengViet";
import { LevelModal, ResumeModal, AnswerSelectionModal, SubmitConfirmModal, ScoreModal, AIPickLevelModal, AIModal, AIModalExam, UnfinishedQuestionsModal } from "../components/monhoc/MathModals";

function VietnamesePage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [activeLesson, setActiveLesson] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [breadcrumbParts, setBreadcrumbParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openStates, setOpenStates] = useState([false, false]);
  const [filterRef, filterVisible] = useInView(0.1, {
    initialVisible: false,
    animateOnMount: true,
  });
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [lessonToResume, setLessonToResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [levelProgresses, setLevelProgresses] = useState({});
  const [examProgresses, setExamProgresses] = useState({});
  const [showAnswerSelectionModal, setShowAnswerSelectionModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [exams, setExams] = useState([]);
  const [topicExams, setTopicExams] = useState([]);
  const [activeExamTopic, setActiveExamTopic] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showUnfinishedModal, setShowUnfinishedModal] = useState(false);
  const [unfinishedNumbers, setUnfinishedNumbers] = useState([]);
  const [showAIPickLevelModal, setShowAIPickLevelModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  const [showAIExamModal, setShowAIExamModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExamDescription, setSelectedExamDescription] = useState("");
  const [selectedExamPeriod, setSelectedExamPeriod] = useState("");

  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const levelLabels = {
    de: "Dễ",
    trungbinh: "Trung bình",
    nangcao: "Nâng cao",
  };

  const {
    grades,
    subjectsByGrade,
    topics,
    lessons,
    setLessons,
    questions,
    setQuestions,
    fetchLessonsByTopic,
    progressMap,
  } = useVietnameseApi(selectedClass, selectedSubject, activeLesson, selectedLevel);

  const lessonLogic = useLessonLogicViet({
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
    selectedLevel, // Added to pass to useLessonLogic
    levelLabels, // Added to pass to useLessonLogic
    userAnswers,
  });

  const examLogic = useExamLogicViet({
    selectedSubject,
    selectedClass,
    subjectsByGrade,
    topics,
    setQuestions,
    questions,
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
  });

  useEffect(() => {
    try {
      const savedStudent = JSON.parse(localStorage.getItem("selectedStudent"));
      if (savedStudent?.class) {
        setSelectedClass(savedStudent.class.toString());
        setTimeout(() => {
          if (subjectsByGrade.length > 0) {
            setSelectedSubject(subjectsByGrade[0]._id);
          }
        }, 300);
      }
    } catch (err) {
      console.error("Không thể đọc selectedStudent từ localStorage:", err);
    }
  }, [subjectsByGrade]);

  const toggleOpen = (index) => {
    setOpenStates((prev) =>
      prev.map((state, i) => (i === index ? !state : false))
    );
  };

  const handleAnswerClick = (questionId, answerKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selected: answerKey,
      },
    }));
    // ✅ Nếu câu này trước đó bị "bỏ qua", thì bỏ nó ra khỏi skippedQuestions
    setSkippedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    if (!examLogic.activeExam) {
      setIsChecked(false);
    }
  };

  const handleConfirmAIExam = async () => {
    try {
      setIsLoadingAI(true); // bật loading
      const res = await generateExamPractice(selectedExamId, 10); // gọi API
      const data = res.data.data;
      // Điều hướng sang trang AI Question
      navigate("/ai-question", {
        state: {
          isExamAI: true, // đánh dấu là AI theo Exam
          examId: selectedExamId,
          examTitle: selectedExamDescription,
          questions: data.questions,
          practiceSessionId: data.practiceSessionId,
        },
      });
      setShowAIExamModal(false); // đóng modal
    } catch (err) {
      console.error("❌ Lỗi tạo đề AI cho Exam:", err);
      alert("Không thể tạo đề AI. Vui lòng thử lại.");
    } finally {
      setIsLoadingAI(false); // tắt loading
    }
  };

  const handleCheckAnswer = async () => {
    const q = questions[currentQuestionIndex];
    const answer = userAnswers[q._id]?.selected;
    if (!answer) {
      setShowAnswerSelectionModal(true);
      return;
    }

    setIsTransitioning(true);
    try {
      const res = await checkAnswer(q._id, answer);
      const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;

      // setUserAnswers((prev) => ({
      //   ...prev,
      //   [q._id]: {
      //     ...prev[q._id],
      //     isCorrect,
      //     correctAnswer,
      //     correctAnswerText,
      //   },
      // }));

      // --- Cập nhật userAnswers VỚI GIÁ TRỊ MỚI ---
      const updatedAnswers = {
        ...userAnswers,
        [q._id]: {
          ...userAnswers[q._id],
          isCorrect,
          correctAnswer,
          correctAnswerText,
        },
      };
      setUserAnswers(updatedAnswers);

      setIsChecked(true);

      // ✅ Nếu câu này từng bị "bỏ qua", xóa khỏi skippedQuestions
      setSkippedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(q._id);
        return newSet;
      });

      // --- REAL-TIME SCORE UPDATE ---
      const total = questions.length;
      const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
      const currentScore = total > 0 ? Math.round((correct / total) * 100) : 0;
      setScore(currentScore);

      const studentId = localStorage.getItem("studentId");
      if (studentId && activeLesson) {
        await saveAnswerProgress(studentId, {
          refType: "Lesson",
          refId: activeLesson,
          level: selectedLevel,
          questionId: q._id,
          selected: answer,
          isCorrect,
          score: currentScore,
          correctAnswers: correct,
          totalQuestions: total,
        });
      }
    } catch (err) {
      console.error("❌ Lỗi kiểm tra đáp án:", err);
    } finally {
      setIsTransitioning(false);
    }
  };

  // const handleNextQuestion = async () => {
  //   const q = questions[currentQuestionIndex];
  //   const answer = userAnswers[q._id]?.selected;

  //   if (!answer && !skippedQuestions.has(q._id)) {
  //     setShowAnswerSelectionModal(true);
  //     return;
  //   }

  //   if (!examLogic.activeExam && answer) {
  //     const res = await checkAnswer(q._id, answer);
  //     const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;
  //     // setUserAnswers((prev) => ({
  //     //   ...prev,
  //     //   [q._id]: {
  //     //     ...prev[q._id],
  //     //     isCorrect,
  //     //     correctAnswer,
  //     //     correctAnswerText,
  //     //   },
  //     // }));
  //     const updatedAnswers = {
  //       ...userAnswers,
  //       [q._id]: {
  //         selected: answer,
  //         isCorrect,
  //         correctAnswer,
  //         correctAnswerText,
  //       },
  //     };
  //     setUserAnswers(updatedAnswers);

  //     // Tính lại điểm
  //     const total = questions.length;
  //     const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
  //     const currentScore = Math.round((correct / total) * 100);
  //     setScore(currentScore);

  //     const studentId = localStorage.getItem("studentId");
  //     if (studentId) {
  //       await saveAnswerProgress(studentId, {
  //         refType: "Lesson",
  //         refId: activeLesson,
  //         level: selectedLevel,
  //         questionId: q._id,
  //         selected: answer,
  //         isCorrect,
  //         score: currentScore,
  //         correctAnswers: correct,
  //         totalQuestions: total,
  //       });
  //     }
  //   }

  //   if (examLogic.activeExam && answer) {
  //     const studentId = localStorage.getItem("studentId");
  //     await saveAnswerProgress(studentId, {
  //       refType: "Exam",
  //       refId: examLogic.activeExam,
  //       questionId: q._id,
  //       selected: answer,
  //     });
  //   }

  //   if (currentQuestionIndex < questions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //     setIsChecked(false);
  //   } else {
  //     if (examLogic.activeExam) {
  //       examLogic.handleFinishExam();
  //     } else {
  //       lessonLogic.handleFinish();
  //     }
  //   }
  // };

  const handleNextQuestion = async () => {
  const q = questions[currentQuestionIndex];
  const answer = userAnswers[q._id]?.selected;

  if (!answer && !skippedQuestions.has(q._id)) {
    setShowAnswerSelectionModal(true);
    return;
  }

  if (!examLogic.activeExam && answer) {
    const res = await checkAnswer(q._id, answer);
    const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;
    const updatedAnswers = {
      ...userAnswers,
      [q._id]: {
        selected: answer,
        isCorrect,
        correctAnswer,
        correctAnswerText,
      },
    };
    setUserAnswers(updatedAnswers);

    // Tính lại điểm
    const total = questions.length;
    const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
    const currentScore = Math.round((correct / total) * 100);
    setScore(currentScore);

    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      await saveAnswerProgress(studentId, {
        refType: "Lesson",
        refId: activeLesson,
        level: selectedLevel,
        questionId: q._id,
        selected: answer,
        isCorrect,
        score: currentScore,
        correctAnswers: correct,
        totalQuestions: total,
      });
    }
  }

  if (examLogic.activeExam && answer) {
    const studentId = localStorage.getItem("studentId");
    await saveAnswerProgress(studentId, {
      refType: "Exam",
      refId: examLogic.activeExam,
      questionId: q._id,
      selected: answer,
    });
  }

  if (currentQuestionIndex < questions.length - 1) {
    const newIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
    
    // THAY ĐỔI MỚI: Set isChecked dựa trên trạng thái của câu hỏi mới
    const newQ = questions[newIndex];
    const hasAnswer = userAnswers[newQ._id];
    setIsChecked(!!hasAnswer && hasAnswer.isCorrect !== undefined);
  } else {
    if (examLogic.activeExam) {
      examLogic.handleFinishExam();
    } else {
      lessonLogic.handleFinish();
    }
  }
};

  // const handlePrevQuestion = async () => {
  //   if (!examLogic.activeExam && userAnswers[questions[currentQuestionIndex]._id]?.selected) {
  //     const q = questions[currentQuestionIndex];
  //     const answer = userAnswers[q._id]?.selected;
  //     const res = await checkAnswer(q._id, answer);
  //     const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;
  //     setUserAnswers((prev) => ({
  //       ...prev,
  //       [q._id]: {
  //         ...prev[q._id],
  //         isCorrect,
  //         correctAnswer,
  //         correctAnswerText,
  //       },
  //     }));

  //     const studentId = localStorage.getItem("studentId");
  //     if (studentId) {
  //       await saveAnswerProgress(studentId, {
  //         refType: "Lesson",
  //         refId: activeLesson,
  //         level: selectedLevel,
  //         questionId: q._id,
  //         selected: answer,
  //         isCorrect,
  //       });
  //     }
  //   }

  //   if (currentQuestionIndex > 0) {
  //     setCurrentQuestionIndex(currentQuestionIndex - 1);
  //     setIsChecked(false);
  //   }
  // };


  // const handlePrevQuestion = async () => {
  //   if (currentQuestionIndex === 0) return;

  //   // Nếu câu hiện tại đã chọn → đảm bảo đã kiểm tra và lưu điểm trước khi rời đi
  //   const currentQ = questions[currentQuestionIndex];
  //   const currentAnswer = userAnswers[currentQ._id]?.selected;

  //   if (!examLogic.activeExam && currentAnswer && !userAnswers[currentQ._id]?.isCorrect) {
  //     try {
  //       const res = await checkAnswer(currentQ._id, currentAnswer);
  //       const { isCorrect } = res.data.data;

  //       const updatedAnswers = {
  //         ...userAnswers,
  //         [currentQ._id]: {
  //           ...userAnswers[currentQ._id],
  //           isCorrect,
  //         },
  //       };
  //       setUserAnswers(updatedAnswers);

  //       const total = questions.length;
  //       const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
  //       const currentScore = Math.round((correct / total) * 100);
  //       setScore(currentScore);

  //       const studentId = localStorage.getItem("studentId");
  //       if (studentId) {
  //         await saveAnswerProgress(studentId, {
  //           refType: "Lesson",
  //           refId: activeLesson,
  //           level: selectedLevel,
  //           questionId: currentQ._id,
  //           selected: currentAnswer,
  //           isCorrect,
  //           score: currentScore,
  //           correctAnswers: correct,
  //           totalQuestions: total,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Lỗi khi quay lại câu trước:", err);
  //     }
  //   }
  //   setCurrentQuestionIndex(currentQuestionIndex - 1);
  //   setIsChecked(false);
  // };

  const handlePrevQuestion = async () => {
    if (currentQuestionIndex === 0) return;

    // Kiểm tra & lưu câu hiện tại nếu chưa check (nhưng đã select)
    const currentQ = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQ._id]?.selected;

    if (!examLogic.activeExam && currentAnswer && userAnswers[currentQ._id]?.isCorrect === undefined) {
      try {
        const res = await checkAnswer(currentQ._id, currentAnswer);
        const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;

        const updatedAnswers = {
          ...userAnswers,
          [currentQ._id]: {
            ...userAnswers[currentQ._id],
            isCorrect,
            correctAnswer,
            correctAnswerText,
          },
        };
        setUserAnswers(updatedAnswers);

        // Tính score real-time (như cũ)
        const total = questions.length;
        const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
        const currentScore = Math.round((correct / total) * 100);
        setScore(currentScore);

        const studentId = localStorage.getItem("studentId");
        if (studentId) {
          await saveAnswerProgress(studentId, {
            refType: "Lesson",
            refId: activeLesson,
            level: selectedLevel,
            questionId: currentQ._id,
            selected: currentAnswer,
            isCorrect,
            score: currentScore,
            correctAnswers: correct,
            totalQuestions: total,
          });
        }
      } catch (err) {
        console.error("Lỗi khi quay lại câu trước:", err);
      }
    }
  
    // Chuyển index
    const newIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(newIndex);

    // Set isChecked cho câu mới (dựa trên việc đã check chưa)
    const newQ = questions[newIndex];
    const hasAnswer = userAnswers[newQ._id];
    setIsChecked(!!hasAnswer && hasAnswer.isCorrect !== undefined);
  };

  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);   // bỏ cờ
      } else {
        newSet.add(questionId);      // đặt cờ
      }
      return newSet;
    });
  };

  const handleSelectAnswerFirst = () => {
    setShowAnswerSelectionModal(false);
  };

  const handleSkipToCheck = async () => {
    setShowAnswerSelectionModal(false);
    setSkippedQuestions((prev) => new Set(prev).add(questions[currentQuestionIndex]._id));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsChecked(false);
    } else {
      if (examLogic.activeExam) {
        examLogic.handleFinishExam();
      } else {
        lessonLogic.handleFinish();
      }
    }
  };

  // const handleQuestionSquareClick = async (index) => {
  //   if (!examLogic.activeExam && userAnswers[questions[currentQuestionIndex]._id]?.selected) {
  //     const q = questions[currentQuestionIndex];
  //     const answer = userAnswers[q._id]?.selected;
  //     const res = await checkAnswer(q._id, answer);
  //     const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;
  //     setUserAnswers((prev) => ({
  //       ...prev,
  //       [q._id]: {
  //         ...prev[q._id],
  //         isCorrect,
  //         correctAnswer,
  //         correctAnswerText,
  //       },
  //     }));

  //     const studentId = localStorage.getItem("studentId");
  //     if (studentId) {
  //       await saveAnswerProgress(studentId, {
  //         refType: "Lesson",
  //         refId: activeLesson,
  //         level: selectedLevel,
  //         questionId: q._id,
  //         selected: answer,
  //         isCorrect,
  //       });
  //     }
  //   }
  //   setCurrentQuestionIndex(index);
  //   setIsChecked(false);
  // };
  const handleQuestionSquareClick = async (index) => {
  // Kiểm tra & lưu câu hiện tại nếu chưa check (tương tự prev)
  const currentQ = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQ._id]?.selected;

  if (!examLogic.activeExam && currentAnswer && userAnswers[currentQ._id]?.isCorrect === undefined) {
    try {
      const res = await checkAnswer(currentQ._id, currentAnswer);
      const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;

      const updatedAnswers = {
        ...userAnswers,
        [currentQ._id]: {
          ...userAnswers[currentQ._id],
          isCorrect,
          correctAnswer,
          correctAnswerText,
        },
      };
      setUserAnswers(updatedAnswers);

      const total = questions.length;
      const correct = Object.values(updatedAnswers).filter(a => a?.isCorrect === true).length;
      const currentScore = Math.round((correct / total) * 100);
      setScore(currentScore);

      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        await saveAnswerProgress(studentId, {
          refType: "Lesson",
          refId: activeLesson,
          level: selectedLevel,
          questionId: currentQ._id,
          selected: currentAnswer,
          isCorrect,
          score: currentScore,
          correctAnswers: correct,
          totalQuestions: total,
        });
      }
    } catch (err) {
      console.error("Lỗi khi click ô vuông:", err);
    }
  }

  // Chuyển index
  setCurrentQuestionIndex(index);

  // Set isChecked cho câu mới
  const newQ = questions[index];
  const hasAnswer = userAnswers[newQ._id];
  setIsChecked(!!hasAnswer && hasAnswer.isCorrect !== undefined);
};

  const handleBackToLessons = async () => {
    if (!examLogic.activeExam && userAnswers[questions[currentQuestionIndex]._id]?.selected) {
      const q = questions[currentQuestionIndex];
      const answer = userAnswers[q._id]?.selected;
      const res = await checkAnswer(q._id, answer);
      const { isCorrect, correctAnswer, correctAnswerText } = res.data.data;
      setUserAnswers((prev) => ({
        ...prev,
        [q._id]: {
          ...prev[q._id],
          isCorrect,
          correctAnswer,
          correctAnswerText,
        },
      }));

      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        await saveAnswerProgress(studentId, {
          refType: "Lesson",
          refId: activeLesson,
          level: selectedLevel,
          questionId: q._id,
          selected: answer,
          isCorrect,
        });
      }
    }
    setQuestions([]);
    setShowVideo(false);
    setActiveLesson("");
    examLogic.setActiveExam("");
    setBreadcrumbParts([]);
    setSelectedLevel("");
    setUserAnswers({});
    setSkippedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setIsChecked(false);
    if (activeTopic) {
      fetchLessonsByTopic(activeTopic);
    }
  };

  const handleTopicClick = (topic) => {
    setActiveExamTopic(null);
    setTopicExams([]);
    setActiveTopic(topic._id);
    setActiveLesson("");
    examLogic.setActiveExam("");
    setQuestions([]);
    setShowVideo(false);
    setBreadcrumbParts([]);
    setSelectedLevel(null);
    setUserAnswers({});
    setSkippedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setIsChecked(false);
    setShowLevelModal(false);
    setVideoUrl("");
    setIsTransitioning(false);
    setShowResumeModal(false);
    setLessonToResume(null);
    setLevelProgresses({});
    setExamProgresses({});
    setShowScoreModal(false);
    setScore(0);
    setCorrectAnswers(0);

    fetchLessonsByTopic(topic._id);
  };

  const handleExamTopicClick = (period) => {
    setActiveTopic(null);
    setActiveLesson(null);
    setLessons([]);

    if (activeExamTopic === period) {
      setActiveExamTopic(null);
      setTopicExams([]);
      return;
    }
    const filtered = exams.filter((e) => e.period.trim() === period.trim());
    setActiveExamTopic(period);
    setTopicExams(filtered);
    examLogic.setActiveExam(null);
    setQuestions([]);
    setShowVideo(false);
  };

  const handleCloseScoreModal = async () => {
    setShowScoreModal(false);
    // ✅ Fetch lại student mới từ API để Header update nuts
    try {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        const res = await getStudentById(studentId);
        localStorage.setItem("selectedStudent", JSON.stringify(res.data.data));
        window.dispatchEvent(new Event("studentUpdated"));
      }
    } catch (err) {
      console.error("❌ Không fetch lại student:", err);
    }
    
    if (examLogic.activeExam) {
      console.log("🔄 Reload toàn trang sau khi nộp bài kiểm tra");
      localStorage.removeItem("examTimeLeft");
      localStorage.removeItem("examProgress");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }
    setIsTransitioning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setQuestions([]);
      setShowVideo(false);
      setActiveLesson("");
      examLogic.setActiveExam("");
      setBreadcrumbParts([]);
      setSelectedLevel("");
      setUserAnswers({});
      setSkippedQuestions(new Set());
      setCurrentQuestionIndex(0);
      setIsChecked(false);

      if (activeTopic) {
        setTimeout(() => {
          fetchLessonsByTopic(activeTopic);
          console.log("🎉 Hoàn thành! Đã refresh dữ liệu.");
        }, 300);
      }
    } catch (err) {
      console.error("❌ Lỗi khi quay lại:", err);
    } finally {
      setIsTransitioning(false);
    }
  };

  const getUnfinishedQuestions = () => {
    const list = [];

    questions.forEach((q, index) => {
      const answered = userAnswers[q._id]?.selected !== undefined;
      const skipped = skippedQuestions.has(q._id);

      if (!answered && !skipped) {
        list.push(index + 1); // số câu (1-based)
      }
    });
    return list;
  };

  const handleSubmitWithCheck = () => {
    const unfinished = getUnfinishedQuestions();

    if (unfinished.length > 0) {
      setUnfinishedNumbers(unfinished);
      setShowUnfinishedModal(true);
      return;
    }

    // không còn câu bỏ trống → show confirm modal như cũ
    if (examLogic.activeExam) {
      examLogic.setShowSubmitConfirmModal(true);
    } else {
      lessonLogic.setShowSubmitConfirmModal(true);
    }
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedSubject) {
      getExamsBySubject(selectedSubject).then((res) => {
        setExams(res.data.data || []);
      }).catch((err) => console.error("❌ Lỗi fetch exams:", err));
    } else {
      setExams([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    const saveLocalProgress = () => {
      if (examLogic.activeExam) {
        localStorage.setItem(
          "examProgress",
          JSON.stringify({
            examId: examLogic.activeExam,
            currentQuestionIndex,
            userAnswers,
          })
        );
      }
    };
    window.addEventListener("beforeunload", saveLocalProgress);
    return () => window.removeEventListener("beforeunload", saveLocalProgress);
  }, [examLogic.activeExam, currentQuestionIndex, userAnswers]);

  useEffect(() => {
    if (questions.length > 0 && (activeLesson || examLogic.activeExam) && !showVideo) {
      const className = selectedClass ? `Lớp ${selectedClass}` : "";
      const subjectName = subjectsByGrade.find((s) => s._id === selectedSubject)?.name || "";
      let newBreadcrumb = [];

      if (activeLesson) {
        const topicName = topics.find((t) => t._id === activeTopic)?.title || "";
        const lessonName = lessons.find((l) => l._id === activeLesson)?.title || "";
        const levelLabel = levelLabels[selectedLevel] || selectedLevel;
        newBreadcrumb = [`${className} - ${subjectName}`, topicName, lessonName, levelLabel];
      } else if (examLogic.activeExam) {
        const exam = exams.find((e) => e._id === examLogic.activeExam);
        const examName = exam ? exam.period : "";
        newBreadcrumb = [`${className} - ${subjectName}`, "Kiểm tra", examName];
      }

      if (JSON.stringify(breadcrumbParts) !== JSON.stringify(newBreadcrumb)) {
        setBreadcrumbParts(newBreadcrumb);
      }
    }
  }, [
    questions.length,
    activeLesson,
    examLogic.activeExam,
    selectedLevel,
    selectedClass,
    selectedSubject,
    activeTopic,
    lessons,
    subjectsByGrade,
    topics,
    exams,
    showVideo,
    breadcrumbParts,
  ]);
  if (lessonLogic.isLoading || examLogic.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <GlobalStyle />
      <Header />
      <ContentWrapper>
        <Sidebar>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Tìm nhanh chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={lessonLogic.isLoading || examLogic.isLoading}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchBox>
          {filteredTopics.map((t) => (
            <TopicItem
              key={t._id}
              active={t._id === activeTopic ? true : undefined}
              onClick={() => handleTopicClick(t)}
              style={{ opacity: lessonLogic.isLoading || examLogic.isLoading ? 0.5 : 1, pointerEvents: lessonLogic.isLoading || examLogic.isLoading ? "none" : "auto" }}
            >
              <TopicTitle>{t.title}</TopicTitle>
            </TopicItem>
          ))}
          {exams.length > 0 && (
            <div style={{ marginTop: "20px", padding: "10px", borderTop: "1px solid #ddd" }}>
              <ExamTitle
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  fontFamily: "Impress",
                  fontSize: "20px",
                }}
              >
                KIỂM TRA
              </ExamTitle>
              {Array.from(new Set(exams.map((e) => e.period.trim()))).map((period) => (
                <TopicItem
                  key={period}
                  active={activeExamTopic === period}
                  onClick={() => handleExamTopicClick(period)}
                >
                  <TopicTitle>{period}</TopicTitle>
                </TopicItem>
              ))}
            </div>
          )}
        </Sidebar>
        <MainContent style={{ position: "relative" }}>
          <MathSectionComponent
            filterRef={filterRef}
            filterVisible={filterVisible}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            grades={grades}
            subjectsByGrade={subjectsByGrade}
            openStates={openStates}
            toggleOpen={toggleOpen}
          />
          {/* {(activeLesson || examLogic.activeExam) && questions.length > 0 && (
            <TimerContainer>
              <TimerBox
                isDanger={
                  examLogic.activeExam
                    ? examLogic.timeLeft <= 60 // ⚠️ Chỉ cảnh báo khi là Exam
                    : false
                }
              >
                {examLogic.activeExam ? "⏳Thời gian còn lại: " : "🕒Thời gian đã học: "}
                {(() => {
                  const time = examLogic.activeExam
                    ? examLogic.timeLeft
                    : lessonLogic.timeLeft;
                  const minutes = Math.floor(time / 60)
                    .toString()
                    .padStart(2, "0");
                  const seconds = (time % 60).toString().padStart(2, "0");
                  return `${minutes}:${seconds}`;
                })()}
                {examLogic.activeExam ? "⏳" : "🕓"}
              </TimerBox>
            </TimerContainer>
          )} */}
          <BreadcrumbComponent
            breadcrumbParts={breadcrumbParts}
            questions={questions}
            showVideo={showVideo}
            handleBackToLessons={handleBackToLessons}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            skippedQuestions={skippedQuestions}
            handleQuestionSquareClick={handleQuestionSquareClick}
          />

          {showVideo && (
            <VideoComponent
              lesson={lessons.find((l) => l._id === activeLesson) || { urlVideo: "https://www.youtube.com/watch?v=WXd0BHS8eFc" }}
            />
          )}

          {questions.length === 0 && !showVideo && lessons.length > 0 && !examLogic.activeExam && (
            <LessonGridComponent
              lessons={lessons}
              activeLesson={activeLesson}
              progressMap={progressMap}
              handleLessonClick={lessonLogic.handleLessonClick}
              handleTheoryClick={lessonLogic.handleTheoryClick}
              onAIClick={(lesson) => {
                setSelectedLessonId(lesson._id);
                setSelectedLessonTitle(lesson.title);
                setShowAIModal(true);
              }}
            />
          )}

          {questions.length === 0 && !showVideo && topicExams.length > 0 && (
            <LessonGrid>
              {topicExams.map((exam) => (
                <LessonCard key={exam._id}>
                  <NutsWrapper>
                    <NutsText>+{exam.rewardNuts || 0}</NutsText>
                    <NutsIcon src="https://cdn-icons-png.flaticon.com/512/6267/6267035.png" alt="Nuts"/>
                    <NutsTooltip>Đạt điểm tối đa để nhận được {exam.rewardNuts || 0} hạt dẻ!</NutsTooltip>
                  </NutsWrapper>
            
                  <LessonContent>
                    <LessonImageContainer>
                      <LessonImage src="https://cdn-icons-png.flaticon.com/512/201/201565.png" alt="Exam"/>
                    </LessonImageContainer>
                    <LessonTitle>{exam.description}</LessonTitle>
                    <LessonIcons>
                      <IconItem
                        onClick={(e) => {
                          e.stopPropagation();
                          examLogic.handleExamClick(exam);
                        }}
                      >
                        <TheoryIcon src="https://cdn-icons-png.flaticon.com/512/992/992700.png" alt="Làm bài"/>
                        <IconLabel>Làm bài</IconLabel>
                      </IconItem>
                      <IconItem
                        onClick={(e) => {
                          e.stopPropagation();
                          // set selected exam data -> mở modal xác nhận AI cho exam
                          setSelectedExamId(exam._id);
                          setSelectedExamDescription(exam.description || exam.title || "Kỳ thi");
                          setSelectedExamPeriod(exam.period || "");
                          setShowAIExamModal(true);
                        }}
                        title="Làm bài AI"
                      >
                        <TheoryIcon src="https://cdn-icons-png.flaticon.com/512/13298/13298257.png" alt="AI"/>
                        <IconLabel>Làm bài AI</IconLabel>
                      </IconItem>
                    </LessonIcons>
                  </LessonContent>
                </LessonCard>
              ))}
            </LessonGrid>
          )}

          {questions.length > 0 && (
            <QuestionLayout>
              {/* CỘT TRÁI – CÂU HỎI */}
              <div style={{ flex: 1 }}>
                <QuestionComponent
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  userAnswers={userAnswers}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  handleAnswerClick={handleAnswerClick}
                  handleCheckAnswer={handleCheckAnswer}
                  handlePrevQuestion={handlePrevQuestion}
                  handleNextQuestion={handleNextQuestion}
                  handleFinish={lessonLogic.handleFinish}
                  handleFinishExam={examLogic.handleFinishExam}
                  setUserAnswers={setUserAnswers}
                  isTransitioning={isTransitioning}
                  isExam={!!examLogic.activeExam}
                  textPassage={
                    examLogic.activeExam
                      ? examLogic.textPassage
                      : lessonLogic.textPassage
                  }
                  flaggedQuestions={flaggedQuestions}
                  handleToggleFlag={handleToggleFlag}
                />
              </div>
              
              {/* CỘT PHẢI – Ô VUÔNG CÂU HỎI */}
              <QuestionSidebar>
                {(activeLesson || examLogic.activeExam) && questions.length > 0 && (
                  <TimerContainer>
                    <TimerBox
                      isDanger={
                        examLogic.activeExam
                          ? examLogic.timeLeft <= 60 // ⚠️ Chỉ cảnh báo khi là Exam
                          : false
                      }
                    >
                      {examLogic.activeExam ? "⏳Thời gian còn lại: " : "🕒Thời gian đã học: "}
                      {(() => {
                        const time = examLogic.activeExam
                          ? examLogic.timeLeft
                          : lessonLogic.timeLeft;
                        const minutes = Math.floor(time / 60)
                          .toString()
                          .padStart(2, "0");
                        const seconds = (time % 60).toString().padStart(2, "0");
                        return `${minutes}:${seconds}`;
                      })()}
                      {examLogic.activeExam ? "⏳" : "🕓"}
                    </TimerBox>
                  </TimerContainer>
                )}
                {/* Hiển thị số câu hỏi hiện tại */}
                {questions.length > 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: 12,
                      padding: "8px 12px",
                      background: "#f1f3f5",
                      borderRadius: 8,
                      fontWeight: "600",
                      fontSize: 16,
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Câu hỏi số: {currentQuestionIndex + 1}/{questions.length}
                  </div>
                )}
                <QuestionSquaresContainer style={{ justifyContent: 'center' }}>
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[q._id]?.selected !== undefined;
                    const isSkipped = skippedQuestions.has(q._id);
                    return (
                      <QuestionSquare
                        key={q._id}
                        isAnswered={isAnswered}
                        isSkipped={isSkipped}
                        isActive={idx === currentQuestionIndex}
                        isFlagged={flaggedQuestions.has(q._id)}
                        onClick={() => handleQuestionSquareClick(idx)}
                      >
                        {idx + 1}
                      </QuestionSquare>
                    );
                  })}
                </QuestionSquaresContainer>
                <SubmitButton
                  onClick={handleSubmitWithCheck}
                >
                  Nộp bài
                </SubmitButton>
                {/* HIỂN THỊ ĐIỂM SỐ */}
                {questions.length > 0 && !examLogic.activeExam && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 14px",
                      background: "#f1f3f5",
                      borderRadius: 8,
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 16,
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Điểm số: {score}
                  </div>
                )}
              </QuestionSidebar>
            </QuestionLayout>
          )}
        </MainContent>
      </ContentWrapper>

      <LevelModal
        show={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        onSelectLevel={lessonLogic.handleLevelSelect}
        levelProgresses={levelProgresses}
        isLoading={lessonLogic.isLoading}
      />
      <ResumeModal
        show={showResumeModal}
        lessonToResume={lessonToResume}
        activeExam={examLogic.activeExam}
        levelLabels={levelLabels}
        selectedLevel={selectedLevel}
        onClose={() => setShowResumeModal(false)}
        onResume={() => {
          if (examLogic.activeExam) examLogic.handleResumeExam(lessonToResume);
          else lessonLogic.handleResumeQuiz(lessonToResume);
        }}
        onRestart={async () => {
          // 🔹 Hiển thị loading
          const isLoadingSetter = examLogic.activeExam ? examLogic.setIsLoading : lessonLogic.setIsLoading;
          isLoadingSetter(true);
          const studentId = localStorage.getItem("studentId");
          if (studentId) {
            // ✅ Gọi backend reset: xóa sạch answers, giữ status = in_progress
            await resetProgress(
              studentId,
              examLogic.activeExam ? "Exam" : "Lesson",
              lessonToResume._id,
              examLogic.activeExam ? "" : selectedLevel
            );
            // ✅ Tạo record trống (đảm bảo frontend và backend sync)
            await saveAnswerProgress(studentId, {
              refType: examLogic.activeExam ? "Exam" : "Lesson",
              refId: lessonToResume._id,
              level: examLogic.activeExam ? "" : selectedLevel,
              status: "in_progress",
              answers: [],
              correctAnswers: 0,
              totalQuestions: 0,
              timeSpent: 0,
            });
            // ✅ Clear dữ liệu localStorage để không load lại tiến trình cũ
            // localStorage.removeItem("lessonTimeLeft");
            // localStorage.removeItem("examTimeLeft");
            // localStorage.removeItem("lessonProgress");
            // localStorage.removeItem("examProgress");
            
            // CHỈ XÓA KEY TƯƠNG ỨNG VỚI LOẠI ĐANG RESET
            if (examLogic.activeExam) {
              localStorage.removeItem("examTimeLeft");
            } else {
              localStorage.removeItem("lessonTimeLeft");
            }

            // Reset timer về giá trị mặc định
            if (examLogic.activeExam) {
              localStorage.setItem("examTimeLeft", "2400");
              examLogic.setTimeLeft(2400);
            } else {
              localStorage.setItem("lessonTimeLeft", "0");
              lessonLogic.setTimeLeft(0);
            }

            // ✅ Reset local timer - LESSON = 0, EXAM = 2400
            // if (examLogic.activeExam) {
            //   localStorage.setItem("examTimeLeft", "600");
            //   examLogic.setTimeLeft(600);
            // } else {
            //   localStorage.setItem("lessonTimeLeft", "0");
            //   lessonLogic.setTimeLeft(0);
            // }
            
            // ✅ Reset state trong frontend
            setShowResumeModal(false);
            setUserAnswers({});
            setSkippedQuestions(new Set());
            setCurrentQuestionIndex(0);
            // ✅ Load lại dữ liệu mới (từ đầu)
            if (examLogic.activeExam) {
              await examLogic.handleExamClick(lessonToResume, true);
            } else {
              await lessonLogic.handleLevelSelect(selectedLevel, true);
            }
          }
          // 🔹 Tắt loading
          isLoadingSetter(false);
        }}
        isLoading={lessonLogic.isLoading || examLogic.isLoading}
      />
      <AnswerSelectionModal
        show={showAnswerSelectionModal}
        onClose={() => setShowAnswerSelectionModal(false)}
        onSkip={handleSkipToCheck}
      />
      <SubmitConfirmModal
        show={lessonLogic.showSubmitConfirmModal || examLogic.showSubmitConfirmModal}
        onConfirm={() => {
          if (examLogic.activeExam) {
            examLogic.handleConfirmSubmitExam(questions, userAnswers);
          } else {
            lessonLogic.handleConfirmSubmitLesson();
          }
        }}
        onCancel={() => {
          if (examLogic.activeExam) {
            examLogic.setShowSubmitConfirmModal(false);
          } else {
            lessonLogic.setShowSubmitConfirmModal(false);
          }
        }}
        isLoading={isTransitioning}
      />
      <ScoreModal
        show={showScoreModal}
        onClose={handleCloseScoreModal}
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
      />
      <AIPickLevelModal
        show={showAIPickLevelModal}
        onClose={() => setShowAIPickLevelModal(false)}
        isLoading={isLoadingAI}
        onPickLevel={async (level) => {
          try {
            setIsLoadingAI(true); // 🔹 bật loading
            console.log("🚀 Gọi API tạo đề AI:", { lessonId: selectedLessonId, level });
            const res = await generatePractice(selectedLessonId, level);
            const data = res.data.data;
            console.log("✅ Đề AI tạo thành công:", data);
            // 🔹 Sau khi có dữ liệu, tắt modal + loading và chuyển trang
            setShowAIPickLevelModal(false);
            navigate("/ai-question", {
              state: {
                lessonId: selectedLessonId,
                lessonTitle: selectedLessonTitle,
                level,
                questions: data.questions || [],
                practiceSessionId: data.practiceSessionId,
              },
            });
          } catch (err) {
            console.error("❌ Lỗi tạo đề AI:", err);
            alert("Không thể tạo đề AI, vui lòng thử lại.");
          } finally {
            setIsLoadingAI(false); // 🔹 tắt loading
          }
        }}
      />
      <AIModal
        show={showAIModal}
        onClose={() => setShowAIModal(false)}
        onConfirm={() => {
          setShowAIModal(false);
          setShowAIPickLevelModal(true);
          // navigate("/ai-question", {
          //   state: { lessonId: selectedLessonId, lessonTitle: selectedLessonTitle },
          // });
        }}
        lessonTitle={selectedLessonTitle}
      />
      <AIModalExam
        show={showAIExamModal}
        onClose={() => setShowAIExamModal(false)}
        onConfirm={handleConfirmAIExam}
        examDescription={selectedExamDescription} // AIModal hiển thị nội dung, ta dùng description
        examPeriod={selectedExamPeriod}
        isLoading={isLoadingAI}
      />
      {showUnfinishedModal && (
        <UnfinishedQuestionsModal
          show={showUnfinishedModal}
          unfinishedList={unfinishedNumbers}
          onClose={() => setShowUnfinishedModal(false)}
          onConfirm={() => {
            setShowUnfinishedModal(false);
            if (examLogic.activeExam) {
              examLogic.setShowSubmitConfirmModal(true);
            } else {
              lessonLogic.setShowSubmitConfirmModal(true);
            }
          }}
        />
      )}
      <Footer />
    </>
  );
}

export default VietnamesePage;