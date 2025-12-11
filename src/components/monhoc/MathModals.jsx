// components/monhoc/MathModals.jsx
import React from "react";
import {
  LevelModalOverlay,
  LevelModalContent,
  LevelButtons,
  LevelButton,
  CloseButton,
  AnswerSelectionModalOverlay,
  AnswerSelectionModalContent,
  AnswerSelectionModalIcon,
  AnswerSelectionModalTitle,
  AnswerSelectionModalDescription,
  AnswerSelectionModalButtons,
  AnswerSelectionModalButton,
  ScoreModalOverlay,
  ScoreModalContent,
  ScoreModalTitle,
  ScoreModalDescription,
  ScoreModalButton,
  AILoadingContainer,
  AILoadingSpinner,
  AILoadingTitle,
  AILoadingSubtitle,
} from "../../pages/styles/MonHocPage.styles";
import { FaTimes } from "react-icons/fa";

export const LevelModal = ({
  show,
  onClose,
  onSelectLevel,
  levelProgresses,
  isLoading,
}) => {
  if (!show) return null;
  return (
    <LevelModalOverlay>
      <LevelModalContent>
        <CloseButton onClick={onClose} disabled={isLoading}>
          <FaTimes />
        </CloseButton>
        <h3 style={{ marginBottom: "15px", fontFamily: "Montserrat-Medium, sans-serif" }}>
          Bạn muốn chọn cấp độ nào?
        </h3>
        <LevelButtons>
          {["de", "trungbinh", "nangcao"].map((level) => (
            <div key={level} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <LevelButton
                onClick={() => onSelectLevel(level)}
                disabled={isLoading}
                title={levelProgresses[level] > 0 ? `Tiến độ: ${levelProgresses[level]}%` : ""}
              >
                {level === "de" ? "Dễ" : level === "trungbinh" ? "Trung bình" : "Nâng cao"}
              </LevelButton>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: levelProgresses[level] > 0 ? "#007bff" : "#666",
                  fontFamily: "Montserrat-Medium, sans-serif",
                }}
              >
                {levelProgresses[level] > 0 ? `${levelProgresses[level]}%` : "0%"}
              </div>
            </div>
          ))}
        </LevelButtons>
      </LevelModalContent>
    </LevelModalOverlay>
  );
};

export const ResumeModal = ({
  show,
  lessonToResume,
  activeExam,
  levelLabels,
  selectedLevel,
  onClose,
  onResume,
  onRestart,
  isLoading,
}) => {
  if (!show || !lessonToResume) return null;
  return (
    <LevelModalOverlay>
      <LevelModalContent>
        <CloseButton onClick={onClose} disabled={isLoading}>
          <FaTimes />
        </CloseButton>
        <h3 style={{ marginBottom: "15px", fontFamily: "Montserrat-Medium, sans-serif" }}>
          {activeExam
            ? `Bạn muốn làm tiếp bài kiểm tra "${lessonToResume.period}" không?`
            : `Bạn muốn làm tiếp bài học "${lessonToResume.title}" với mức độ ${levelLabels[selectedLevel]} không?`}
        </h3>
        <LevelButtons>
          <LevelButton onClick={onResume} bgColor="#007bff" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Tiếp tục"}
          </LevelButton>
          <LevelButton onClick={onRestart} bgColor="red" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Làm lại từ đầu"}
          </LevelButton>
        </LevelButtons>
      </LevelModalContent>
    </LevelModalOverlay>
  );
};

export const AnswerSelectionModal = ({
  show,
  onClose,
  onSkip,
}) => {
  if (!show) return null;
  return (
    <AnswerSelectionModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <AnswerSelectionModalContent>
        <AnswerSelectionModalIcon>❓</AnswerSelectionModalIcon>
        <AnswerSelectionModalTitle>Vui lòng chọn đáp án!</AnswerSelectionModalTitle>
        <AnswerSelectionModalDescription>Vui lòng chọn một đáp án trước khi tiếp tục.</AnswerSelectionModalDescription>
        <AnswerSelectionModalButtons>
          <AnswerSelectionModalButton onClick={onClose}>Đóng</AnswerSelectionModalButton>
          <AnswerSelectionModalButton onClick={onSkip}>Bỏ qua</AnswerSelectionModalButton>
        </AnswerSelectionModalButtons>
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};

export const SubmitConfirmModal = ({
  show,
  onConfirm,
  onCancel,
  isLoading = false, // ✅ thêm prop để disable khi đang xử lý
}) => {
  if (!show) return null;
  return (
    <AnswerSelectionModalOverlay>
      <AnswerSelectionModalContent>
        <AnswerSelectionModalIcon>📝</AnswerSelectionModalIcon>
        <AnswerSelectionModalTitle>Xác nhận nộp bài</AnswerSelectionModalTitle>
        <AnswerSelectionModalDescription>
          Bạn có chắc chắn muốn nộp bài không? Sau khi nộp sẽ không thể thay đổi đáp án.
        </AnswerSelectionModalDescription>

        <AnswerSelectionModalButtons>
          <AnswerSelectionModalButton
            onClick={onConfirm}
            style={{ background: "#28a745", color: "white" }}
            disabled={isLoading} // ✅ khóa nút khi đang xử lý
          >
            {isLoading ? "Đang nộp..." : "Xác nhận"}
          </AnswerSelectionModalButton>

          <AnswerSelectionModalButton
            onClick={onCancel}
            style={{ background: "#dc3545", color: "white" }}
            disabled={isLoading} // ✅ khóa luôn nút Quay lại
          >
            Quay lại
          </AnswerSelectionModalButton>
        </AnswerSelectionModalButtons>
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};

export const ScoreModal = ({
  show,
  onClose,
  score,
  correctAnswers,
  totalQuestions,
}) => {
  if (!show) return null;
  return (
    <ScoreModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ScoreModalContent>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <ScoreModalTitle>Chúc mừng bạn đã hoàn thành!</ScoreModalTitle>
        <ScoreModalDescription>
          Điểm của bạn: <strong>{score}/100</strong>
          <br />
          Số câu đúng: <strong>{correctAnswers}/{totalQuestions}</strong>
        </ScoreModalDescription>
        <ScoreModalButton onClick={onClose}>Quay lại</ScoreModalButton>
      </ScoreModalContent>
    </ScoreModalOverlay>
  );
};

export const AIPickLevelModal = ({
  show,
  onClose,
  onPickLevel,
  isLoading = false,
}) => {
  if (!show) return null;

  return (
    <AnswerSelectionModalOverlay
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <AnswerSelectionModalContent>
        {isLoading ? (
          <AILoadingContainer>
            <AILoadingSpinner />
            <AILoadingTitle>Đang tải câu hỏi AI...</AILoadingTitle>
            <AILoadingSubtitle>
              AI đang tạo đề luyện tập phù hợp với mức độ mà bạn đã chọn ✨
            </AILoadingSubtitle>
          </AILoadingContainer>
        ) : (
          <>
            <AnswerSelectionModalIcon>⚙️</AnswerSelectionModalIcon>
            <AnswerSelectionModalTitle>
              Chọn mức độ luyện tập AI
            </AnswerSelectionModalTitle>

            <LevelButtons style={{ marginTop: 8 }}>
              <LevelButton onClick={() => onPickLevel("de")}>Dễ</LevelButton>
              <LevelButton onClick={() => onPickLevel("trungbinh")}>Trung bình</LevelButton>
              <LevelButton onClick={() => onPickLevel("nangcao")}>Nâng cao</LevelButton>
            </LevelButtons>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AnswerSelectionModalButton
                onClick={onClose}
                style={{ background: "#dc3545", color: "#fff" }}
              >
                Quay lại
              </AnswerSelectionModalButton>
            </div>
          </>
        )}
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};

export const AIModal = ({
  show,
  onClose,
  onConfirm,
  lessonTitle = "Bài học",
}) => {
  if (!show) return null;

  return (
    <AnswerSelectionModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <AnswerSelectionModalContent>
        <AnswerSelectionModalIcon>🤖</AnswerSelectionModalIcon>
        <AnswerSelectionModalTitle>
          Bạn muốn luyện tập
          <br/>"{lessonTitle}"
          <br/>do AI tạo ra không?
        </AnswerSelectionModalTitle>

        <AnswerSelectionModalButtons>
          <AnswerSelectionModalButton
            onClick={onConfirm}
            style={{ background: "#28a745", color: "white" }}
          >
            Xác nhận
          </AnswerSelectionModalButton>

          <AnswerSelectionModalButton
            onClick={onClose}
            style={{ background: "#dc3545", color: "white" }}
          >
            Quay lại
          </AnswerSelectionModalButton>
        </AnswerSelectionModalButtons>
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};

export const AIModalExam = ({
  show,
  onClose,
  onConfirm,
  examDescription = "Đề kiểm tra",
  examPeriod = "",
  isLoading = false,
}) => {
  if (!show) return null;

  return (
    <AnswerSelectionModalOverlay
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <AnswerSelectionModalContent>
        <AnswerSelectionModalIcon>🧠</AnswerSelectionModalIcon>
        <AnswerSelectionModalTitle>
          {examPeriod
            ? `Bạn có muốn tạo đề ${examPeriod.toLowerCase()}`
            : "Bạn có muốn tạo đề kiểm tra"}
          <br />
          <strong>“{examDescription}”</strong>
          <br />
          bằng AI không?
        </AnswerSelectionModalTitle>

        <AnswerSelectionModalButtons>
          <AnswerSelectionModalButton
            onClick={onConfirm}
            style={{ background: "#007bff", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo đề..." : "Tạo ngay"}
          </AnswerSelectionModalButton>

          <AnswerSelectionModalButton
            onClick={onClose}
            style={{ background: "#dc3545", color: "white" }}
            disabled={isLoading}
          >
            Quay lại
          </AnswerSelectionModalButton>
        </AnswerSelectionModalButtons>
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};

export const UnfinishedQuestionsModal = ({
  show,
  onClose,
  onConfirm,
  unfinishedList = [],
}) => {
  if (!show) return null;

  return (
    <AnswerSelectionModalOverlay>
      <AnswerSelectionModalContent>
        <AnswerSelectionModalIcon>⚠️</AnswerSelectionModalIcon>

        <AnswerSelectionModalTitle>Bạn chưa làm hết câu hỏi!</AnswerSelectionModalTitle>

        <AnswerSelectionModalDescription style={{ lineHeight: "1.6" }}>
          <div style={{ marginBottom: 10 }}>
            Bạn còn <strong>{unfinishedList.length}</strong> câu chưa trả lời:
          </div>

          <div
            style={{
              background: "#f1f1f1",
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 16,
              color: "#333",
              textAlign: "center",
              fontFamily: "Montserrat-Medium",
            }}
          >
            {unfinishedList.join(", ")}
          </div>
        </AnswerSelectionModalDescription>

        <AnswerSelectionModalButtons>
          <AnswerSelectionModalButton
            onClick={onClose}
            style={{ background: "#dc3545", color: "white" }}
          >
            Làm tiếp
          </AnswerSelectionModalButton>

          <AnswerSelectionModalButton
            onClick={onConfirm}
            style={{ background: "#28a745", color: "white" }}
          >
            Vẫn nộp bài
          </AnswerSelectionModalButton>
        </AnswerSelectionModalButtons>
      </AnswerSelectionModalContent>
    </AnswerSelectionModalOverlay>
  );
};