import React from "react";
import { FaChevronRight, FaStar, FaPlay, FaClock } from "react-icons/fa";
import {
  MathSection,
  MathTitle,
  MathFiltersCustom,
  LessonGrid,
  LessonCard,
  LessonContent,
  LessonImageContainer,
  LessonImage,
  LessonTitle,
  LessonIcons,
  IconItem,
  TheoryIcon,
  IconLabel,
  ProgressContainer,
  ProgressCircle,
  ProgressSvg,
  CircleBg,
  CircleProgress,
  QuestionContainer,
  QuestionText,
  QuestionNumber,
  QuestionImage,
  OptionList,
  OptionListItem,
  AnswerInputContainer,
  AnswerInput,
  AnswerFeedback,
  NavigationButtons,
  NavigationButton,
  NavigationPlaceholder,
  BreadcrumbContainer,
  BreadcrumbWrapper,
  BreadcrumbPart,
  BreadcrumbSeparator,
  BackButton,
  CustomSelect,
  Select,
  VideoContainer,
  CommentContainer,
  CommentForm,
  CommentInput,
  CommentSubmitButton,
  CommentList,
  CommentItem,
  CommentText,
  CommentAvatar,
  CommentHeader,
  CommentTimestamp,
  CommentUsername,
  QuestionSquaresContainer,
  QuestionSquare,
  ProgressPercentage,
  StarRatingContainer,
  StarIcon,
  AnswerExplanation,
  QuestionLayoutWrapper,
  QuestionSquaresColumn,
} from "../../pages/styles/MonHocPage.styles";
import ReactPlayer from "react-player";
import { useReviewLogic } from "../../hooks/useReviewLogic";
const MathSectionComponent = ({ 
  filterRef, 
  filterVisible, 
  selectedClass, 
  setSelectedClass, 
  selectedSubject, 
  setSelectedSubject, 
  grades, 
  subjectsByGrade, 
  openStates, 
  toggleOpen 
}) => {
  return (
    <MathSection 
      ref={filterRef}
      isVisible={filterVisible}
    >
      <MathTitle isVisible={filterVisible}>
        Tiếng Việt Tiểu Học
      </MathTitle>

      <MathFiltersCustom isVisible={filterVisible}>
        <CustomSelect
          className={`custom-select ${openStates[0] ? "open" : ""}`}
          onMouseDown={(e) => {
            e.stopPropagation();
            toggleOpen(0);
          }}
        >
          <Select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject("");
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">Chọn lớp</option>
            {grades.map((g, i) => (
              <option key={i} value={g}>
                Lớp {g}
              </option>
            ))}
          </Select>
        </CustomSelect>

        <CustomSelect
          className={`custom-select ${openStates[1] ? "open" : ""}`}
          onMouseDown={(e) => {
            e.stopPropagation();
            toggleOpen(1);
          }}
        >
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">Chọn kì</option>
            {subjectsByGrade.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </Select>
        </CustomSelect>
      </MathFiltersCustom>
    </MathSection>
  );
};

const LessonGridComponent = ({ lessons, activeLesson, progressMap, handleLessonClick, handleTheoryClick, onAIClick }) => {
  return (
    <LessonGrid>
      {lessons.map((lesson) => (
        <LessonCard key={lesson._id} active={lesson._id === activeLesson}>
          <LessonContent>
            <LessonImageContainer>
              <LessonImage
                src={
                  lesson.image ||
                  "https://mightymath.edu.vn/uploads/pictures/62df5bd2165b7822016ef65e/content_noi-dung-chuong-trinh-toan-lop-3.jpg"
                }
                alt={lesson.title}
              />
            </LessonImageContainer>
            <LessonTitle>{lesson.title}</LessonTitle>
            <LessonIcons>
              <IconItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleTheoryClick(lesson);
                }}
              >
                <TheoryIcon
                  src="https://cdn-icons-png.flaticon.com/512/4237/4237920.png"
                  alt="Lý thuyết"
                />
                <IconLabel>Lý thuyết</IconLabel>
              </IconItem>

              <IconItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleLessonClick(lesson);
                }}
              >
                <TheoryIcon
                  src="https://cdn-icons-png.flaticon.com/512/5402/5402751.png"
                  alt="Ôn tập"
                />
                <IconLabel>Ôn tập</IconLabel>
              </IconItem>

              {/* --- AI Icon (mới) --- */}
              <IconItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof onAIClick === "function") {
                    onAIClick(lesson);
                  } else {
                    console.log("AI icon clicked for lesson:", lesson._id);
                    // bạn có thể mở modal generate AI practice ở đây
                  }
                }}
                title="Tạo đề AI"
              >
                <TheoryIcon
                  src="https://cdn-icons-png.flaticon.com/512/13298/13298257.png"
                  alt="AI"
                />
                <IconLabel>Làm bài AI</IconLabel>
              </IconItem>
              {/* ---------------------- */}
            </LessonIcons>
            <ProgressContainer>
              <ProgressCircle>
                <ProgressSvg>
                  <CircleBg cx="16" cy="16" r="12" />
                  <CircleProgress
                    cx="16" cy="16"
                    r="12"
                    strokeDasharray={2 * Math.PI * 12}
                    strokeDashoffset={
                      2 * Math.PI * 12 * (1 - (progressMap[lesson._id] || 0))
                    }
                  />
                </ProgressSvg>
                <ProgressPercentage>
                  {/* {Math.round((progressMap[lesson._id] || 0) * 100)}% */}
                </ProgressPercentage>
              </ProgressCircle>
              {/* <IconLabel>Tiến độ: {Math.round((progressMap[lesson._id] || 0) * 100)}%</IconLabel> */}
              <IconLabel>Tiến độ: {Math.round((progressMap[lesson._id] || 0) * 100)}%</IconLabel>
            </ProgressContainer>
          </LessonContent>
        </LessonCard>
      ))}
    </LessonGrid>
  );
};

const QuestionComponent = ({ 
  questions, 
  currentQuestionIndex, 
  userAnswers, 
  isChecked, 
  setIsChecked, 
  handleAnswerClick, 
  handleCheckAnswer, 
  handlePrevQuestion, 
  handleNextQuestion, 
  handleFinish,
  handleFinishExam,
  setUserAnswers,
  isTransitioning,
  isExam,
  textPassage,
  flaggedQuestions,
  handleToggleFlag,
}) => {
  const q = questions[currentQuestionIndex];
  const userAnswer = userAnswers[q._id];
  
  const isAnswered = !isExam && !!userAnswer && isChecked && userAnswer.isCorrect !== undefined;
  const isDisabled = isTransitioning || isAnswered;
  const showCheckButton = !isExam && !isChecked;
  const showNavButtons = isExam || (isChecked && userAnswer?.isCorrect !== undefined);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasSelection = !!userAnswer?.selected && userAnswer.selected !== "";

  const [isPlaying, setIsPlaying] = React.useState(false);
  const speechRef = React.useRef(null);

  // Chuyển ký hiệu toán học sang tiếng Việt để đọc TTS
  const convertMathSymbols = (text) => {
    let t = text;

    // 1) Chỉ đọc "chia" nếu dấu : hoặc ÷ nằm giữa 2 số
    t = t.replace(/(\d+)\s*[:÷]\s*(\d+)/g, "$1 chia $2");

    // 2) Dấu : cuối câu → đọc là "hai chấm"
    t = t.replace(/:$/g, " hai chấm");

    // 3) Trường hợp số x số (3x4 hoặc 3 x 4)
    t = t.replace(/(\d+)\s*[xX]\s*(\d+)/g, "$1 nhân $2");

    // 4) Các ký tự 'x' còn lại: chỉ thay nếu không kề bên chữ (unicode letter)
    t = t.replace(/[xX]/g, (m, offset, str) => {
      const prev = str[offset - 1];
      const next = str[offset + 1];

      // kiểm tra ký tự trước/sau có phải chữ (unicode letter) không
      const isPrevLetter = prev ? /\p{L}/u.test(prev) : false;
      const isNextLetter = next ? /\p{L}/u.test(next) : false;

      const isPrevDigit = prev ? /\d/.test(prev) : false;
      const isNextDigit = next ? /\d/.test(next) : false;

      // nếu kề bên chữ => giữ nguyên 'x' (ví dụ "xếp")
      if (isPrevLetter || isNextLetter) return m;

      // nếu kề bên số (1x hoặc x1) => coi như toán học -> nhân
      if (isPrevDigit || isNextDigit) return " nhân ";

      // nếu ở giữa khoảng trắng hoặc dấu câu -> coi là ký hiệu độc lập -> nhân
      return " nhân ";
    });
    // 5) Các dấu toán khác
    t = t.replace(/\+/g, " cộng ");
    t = t.replace(/-/g, " trừ ");
    t = t.replace(/×/g, " nhân ");
    t = t.replace(/=/g, " bằng ");
    t = t.replace(/>/g, " lớn hơn ");
    t = t.replace(/</g, " bé hơn ");
    t = t.replace(/\?/g, " dấu chấm hỏi ");

    // 7) Dọn khoảng trắng thừa
    t = t.replace(/\s{2,}/g, " ").trim();

    return t;
  };

  // Hàm đọc câu hỏi
  const handlePlay = () => {
    if (isPlaying) {
      // Đang phát → dừng
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    // 👉 Chuyển ký hiệu trước khi đọc
    const cleanedText = convertMathSymbols(q.questionText);
    
    const utter = new SpeechSynthesisUtterance(cleanedText);
    // Đặt giọng tiếng Việt
    utter.lang = "vi-VN";
    utter.rate = 1;     // tốc độ
    utter.pitch = 1;    // cao độ
    utter.volume = 1;   // âm lượng

    utter.onend = () => setIsPlaying(false);
    speechRef.current = utter;

    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  };

  // 🔹 Auto-play khi load câu hỏi mới
  React.useEffect(() => {
    if (!q) return;

    const cleanedText = convertMathSymbols(q.questionText);
    const utter = new SpeechSynthesisUtterance(cleanedText);
    utter.lang = "vi-VN";
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    utter.onend = () => setIsPlaying(false);

    speechRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);

    return () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, [q._id]);
  
  // Dừng khi chuyển câu hỏi
  // React.useEffect(() => {
  //   window.speechSynthesis.cancel();
  //   setIsPlaying(false);
  // }, [currentQuestionIndex]);

  // Dừng âm thanh khi rời trang, đổi chủ đề, hoặc unmount component
  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <QuestionContainer 
      key={q._id} 
      style={{ 
        opacity: isTransitioning ? 0.7 : 1, 
        transition: 'opacity 0.3s ease',
        pointerEvents: isTransitioning ? 'none' : 'auto'
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
        <button
          onClick={() => handleToggleFlag(q._id)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: flaggedQuestions.has(q._id) ? "#ffe6e6" : "#f0f0f0",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {flaggedQuestions.has(q._id) ? "Bỏ cờ 🚩" : "Đặt cờ 🚩"}
        </button>
        
        <button
          onClick={handlePlay}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#e8f4ff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap"
          }}
        >
          {isPlaying ? "⏸ Tạm dừng" : "▶️ Đọc câu hỏi"}
        </button>
      </div>

      {/* Hiển thị đoạn văn nếu câu hỏi thuộc nhóm đọc hiểu */}
      {q.isReadingQuestion && textPassage && (
        <div
          style={{
            backgroundColor: "#fff8e1",
            borderLeft: "4px solid #ff9800",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "8px",
            whiteSpace: "pre-line",
            lineHeight: "1.6",
          }}
        >
          <strong>📖 Đoạn văn:</strong>
          <br />
          {textPassage}
        </div>
      )}

      <QuestionText>
        <QuestionNumber>Câu {currentQuestionIndex + 1}:</QuestionNumber> {q.questionText}
      </QuestionText>

      {q.image && <QuestionImage src={q.image} alt="question" />}

      {q.options ? (
        <OptionList>
          {Object.entries(q.options).map(([key, value]) => {
            let bgColor = "#fff";
            let textColor = "#000";
            const isSelected = userAnswer?.selected === key;

            if (isAnswered && userAnswer?.isCorrect !== undefined) {
              if (key === q.correctAnswer) {
                bgColor = "#d4edda";
                textColor = "green";
              } else if (isSelected && !userAnswer.isCorrect) {
                bgColor = "#f8d7da";
                textColor = "red";
              }
            } else if (isSelected) {
              bgColor = "#e3f2fd";
              textColor = "#1976d2";
            }

            return (
              <OptionListItem
                key={key}
                onClick={!isDisabled ? () => handleAnswerClick(q._id, key) : undefined}
                selected={isSelected}
                bgColor={bgColor}
                textColor={textColor}
                style={{ 
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {key}. {value}
              </OptionListItem>
            );
          })}
        </OptionList>
      ) : (
        <AnswerInputContainer>
          <AnswerInput
            type="text"
            placeholder="Nhập đáp án của bạn..."
            value={userAnswers[q._id]?.selected || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              setUserAnswers((prev) => ({
                ...prev,
                [q._id]: {
                  selected: inputValue,
                  isCorrect: isExam ? undefined : false,
                },
              }));
            }}
            disabled={isDisabled}
            isAnswered={isAnswered}
            isCorrect={userAnswer?.isCorrect && isChecked}
            style={{
              cursor: isDisabled ? 'not-allowed' : 'text',
              opacity: isDisabled ? 0.7 : 1
            }}
          />
          {isAnswered && userAnswer && (
            <AnswerFeedback isCorrect={userAnswer.isCorrect}>
              {userAnswer.isCorrect ? "✓ Đúng rồi!" : "✗ Sai rồi!"}
            </AnswerFeedback>
          )}
        </AnswerInputContainer>
      )}

      {isChecked && q.explanation && (
        <AnswerExplanation>
          💡 <strong>Giải thích:</strong> {q.explanation}
        </AnswerExplanation>
      )}

      {showCheckButton && !isTransitioning && (
        <NavigationButtons>
          <NavigationPlaceholder />
          <NavigationButton
            onClick={handleCheckAnswer}
            bgColor="#ffc107"
            textColor="#000"
            hasSelection={hasSelection}
            disabled={!hasSelection}
          >
            Kiểm tra
          </NavigationButton>
        </NavigationButtons>
      )}

      {showNavButtons && !isTransitioning && (
        <NavigationButtons>
          {currentQuestionIndex > 0 ? (
            <NavigationButton onClick={handlePrevQuestion} bgColor="#fc7c26">
              Câu trước
            </NavigationButton>
          ) : (
            <NavigationPlaceholder />
          )}
          {!isLastQuestion ? (
            <NavigationButton onClick={handleNextQuestion} bgColor="#007bff">
              Câu tiếp
            </NavigationButton>
          ) : (
            // <NavigationButton onClick={isExam ? handleFinishExam : handleFinish} bgColor="#28a745">
            //   Xong
            // </NavigationButton>
            <NavigationPlaceholder />
          )}
        </NavigationButtons>
      )}

      {isTransitioning && (
        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '14px',
          color: '#007bff'
        }}>
          ⏳ Đang tải...
        </div>
      )}
    </QuestionContainer>
  );
};

const BreadcrumbComponent = ({ 
  breadcrumbParts, 
  questions, 
  showVideo, 
  handleBackToLessons, 
  currentQuestionIndex, 
  userAnswers, 
  skippedQuestions, 
  handleQuestionSquareClick 
}) => {
  const hasContent = (breadcrumbParts && breadcrumbParts.length > 0) || 
                    questions.length > 0 || 
                    showVideo;

  if (!hasContent) {
    return null;
  }

  return (
    <BreadcrumbContainer>
      <div>
        <BreadcrumbWrapper>
          {breadcrumbParts && breadcrumbParts.length > 0 && breadcrumbParts.map((part, index) => (
            <React.Fragment key={index}>
              <BreadcrumbPart>{part}</BreadcrumbPart>
              {index < breadcrumbParts.length - 1 && (
                <BreadcrumbSeparator>
                  <FaChevronRight />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
          
          {(!breadcrumbParts || breadcrumbParts.length === 0) && questions.length > 0 && (
            <BreadcrumbPart>Đang làm bài...</BreadcrumbPart>
          )}
        </BreadcrumbWrapper>
        
        {/* {questions.length > 0 && (
          <QuestionSquaresContainer>
            {questions.map((q, index) => {
              const isAnswered = userAnswers[q._id]?.selected !== undefined;
              const isSkipped = skippedQuestions.has(q._id);
              return (
                <QuestionSquare
                  key={q._id}
                  isAnswered={isAnswered}
                  isSkipped={isSkipped}
                  isActive={index === currentQuestionIndex}
                  onClick={() => handleQuestionSquareClick(index)}
                >
                  {index + 1}
                </QuestionSquare>
              );
            })}
          </QuestionSquaresContainer>
        )} */}
      </div>
      
      {(questions.length > 0 || showVideo) && (
        <BackButton onClick={handleBackToLessons}>Quay lại</BackButton>
      )}
    </BreadcrumbContainer>
  );
};

const getEmbedUrl = (url) => {
  if (!url) return "https://www.youtube.com/embed/WXd0BHS8eFc";
  
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return url;
};

const VideoComponent = ({ lesson }) => {
  const { reviews, stats, rating, setRating, newComment, setNewComment, loading, handleSubmitReview } =
    useReviewLogic(lesson?._id);

  // 🔹 Hàm validation comment (tương tự backend)
  const validateComment = (comment) => {
    const trimmed = comment.trim();
    if (trimmed.length < 5) return "Bình luận phải có ít nhất 5 ký tự";
    if (trimmed.length > 500) return "Bình luận không được vượt quá 500 ký tự";

    const lowerComment = trimmed.toLowerCase();

    // Danh sách từ thô tục (đồng bộ với backend)
    const swearWords = [
      'cặc', 'buồi', 'chim', 'lồn', 'địt', 'dái', 'đéo', 'đm', 'dm', 'vcl', 'vl',
      'đụ', 'đụ má', 'đụ mẹ', 'mẹ mày', 'chó đẻ', 'súc vật', 'cứt', 'lêu lêu',
      'ngu', 'đần', 'đồ ngu', 'thằng ngu', 'con đĩ', 'đĩ mẹ', 'phò'
    ];

    if (swearWords.some(word => lowerComment.includes(word))) {
      return "Bình luận chứa từ ngữ thô tục hoặc không phù hợp";
    }

    if (/(\w)\1{4,}/.test(lowerComment)) {
      return "Bình luận chứa nội dung lặp lại vô nghĩa";
    }

    // 🔹 MỚI: Pattern spam
    if (/([a-zA-ZÀ-ỹ]{1,2})\\1{2,}/.test(lowerComment)) {  // Lưu ý: JS regex cần escape \, nhưng ở đây dùng backticks hoặc new RegExp
      return "Bình luận chứa pattern lặp vô nghĩa (spam)";
    }

    const uniqueChars = new Set(lowerComment.replace(/\s/g, '')).size;
    const nonSpaceLength = lowerComment.replace(/\s/g, '').length;
    const entropyRatio = uniqueChars / nonSpaceLength;
    if (entropyRatio < 0.3 && trimmed.length > 8) {
      return "Bình luận quá ngẫu nhiên, không có ý nghĩa";
    }

    // 🔹 MỚI: Từ hợp lý
    const words = lowerComment.split(/\s+|[.,;?!]/);
    const hasValidWord = words.some(word => word.length >= 3);
    if (!hasValidWord) {
      return "Bình luận phải có ít nhất một từ có nghĩa (≥3 ký tự)";
    }

    if (!/[a-zA-ZÀ-ỹ]/.test(lowerComment)) {
      return "Bình luận phải chứa chữ cái hợp lệ";
    }

    return null;  // Valid
  };

  // 🔹 Hàm submit đã cập nhật
  const onSubmitReview = () => {
    const error = validateComment(newComment);
    if (error) {
      alert(error);  // Hoặc dùng toast library để hiển thị đẹp hơn
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Vui lòng chọn rating từ 1-5 sao");
      return;
    }
    handleSubmitReview();  // Gọi API nếu valid
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>🎬 Video lý thuyết</h2>
      <iframe
        width="100%"
        height="400"
        src={getEmbedUrl(lesson?.urlVideo || "https://www.youtube.com/watch?v=WXd0BHS8eFc")}
        title="Lesson Video"
        allowFullScreen
        style={{ borderRadius: 12 }}
      ></iframe>

      {/* ⭐ Thống kê rating */}
      {stats && (
        <div style={{ marginTop: 20 }}>
          <strong>⭐ Đánh giá trung bình: </strong>
          {stats.averageRating}/5 ({stats.totalReviews} lượt đánh giá)
        </div>
      )}

      {/* 💬 Form nhập bình luận */}
      <div style={{ marginTop: 16 }}>
        <h3>Thêm bình luận</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "gold" : "#ccc",
                fontSize: 22,
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Nhập bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "99%", height: 80, marginTop: 8, padding: 8, borderRadius: 8 }}
        />

        <button
          onClick={onSubmitReview}
          disabled={loading || !newComment.trim()}
          style={{
            marginTop: 8,
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </div>

      {/* 🗨️ Danh sách bình luận */}
      <div style={{ marginTop: 20 }}>
        <h3>Bình luận gần đây</h3>
        {reviews.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                borderBottom: "1px solid #eee",
                marginBottom: 12,
                paddingBottom: 8,
              }}
            >
              {/* Avatar */}
              <img
              src={
                r.studentId?.avatar ||
                "https://via.placeholder.com/40x40?text=🙂"
              }
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            
              {/* Nội dung */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <strong>{r.studentId?.name || "Học sinh"}</strong>
                  <span style={{ color: "gold", fontSize: 14 }}>
                    {"★".repeat(r.rating)}
                    <span style={{ color: "#ccc" }}>
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </span>
                </div>
                <p style={{ margin: "4px 0", lineHeight: 1.4 }}>{r.comment}</p>
                <small style={{ color: "#888" }}>
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CommentSection = () => {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comments, setComments] = React.useState([
    { 
      id: 1, 
      text: "Video giải thích rất dễ hiểu, cảm ơn thầy cô!", 
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      username: "Nguyễn Văn A",
      timestamp: "2025-09-15 10:30",
      rating: 5
    },
    { 
      id: 2, 
      text: "Cho em hỏi thêm về phần công thức này được không ạ?", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      username: "Trần Thị B",
      timestamp: "2025-09-16 14:45",
      rating: 4
    },
  ]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && rating > 0) {
      const newComment = {
        text: comment,
        id: Date.now(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        username: "Bạn",
        timestamp: new Date().toLocaleString("vi-VN", { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        rating
      };
      setComments([newComment, ...comments]);
      setComment("");
      setRating(0);
    }
  };

  return (
    <CommentContainer>
      <CommentForm onSubmit={handleCommentSubmit}>
        <CommentInput
          type="text"
          placeholder="Viết bình luận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <StarRatingContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              as={FaStar}
              isActive={star <= (hoverRating || rating)}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </StarRatingContainer>
        <CommentSubmitButton type="submit" disabled={!comment.trim() || rating === 0}>
          Gửi
        </CommentSubmitButton>
      </CommentForm>
      <CommentList>
        {comments.map((c) => (
          <CommentItem key={c.id}>
            <CommentAvatar src={c.avatar} alt={c.username} />
            <div>
              <CommentHeader>
                <CommentUsername>{c.username}</CommentUsername>
                <CommentTimestamp>{c.timestamp}</CommentTimestamp>
                <StarRatingContainer>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      as={FaStar}
                      isActive={star <= c.rating}
                      style={{ cursor: 'default' }}
                    />
                  ))}
                </StarRatingContainer>
              </CommentHeader>
              <CommentText>{c.text}</CommentText>
            </div>
          </CommentItem>
        ))}
      </CommentList>
    </CommentContainer>
  );
};

export {
  MathSectionComponent,
  LessonGridComponent,
  QuestionComponent,
  BreadcrumbComponent,
  VideoComponent,
  CommentSection
};