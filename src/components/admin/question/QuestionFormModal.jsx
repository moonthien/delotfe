import React from "react";
import GenericModal from "../../common/GenericModal";
import DynamicQuestionsForm from "./DynamicQuestionsForm";

const QuestionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  examId, // ID của exam để tạo câu hỏi
}) => {
  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm câu hỏi mới" : "Chỉnh sửa câu hỏi";
  const defaultIcon = mode === "add" ? "❓" : "✏️";

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (questionsArray) => {
    // Process array of questions to match API format
    const processedQuestions = questionsArray.map((question) => ({
      question: question.question,
      options: [
        question.option1,
        question.option2,
        question.option3,
        question.option4,
      ],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      examId: examId, // Include examId for creating new questions
    }));

    // If editing single question, pass single object, otherwise pass array
    if (mode === "edit") {
      onSubmit(processedQuestions[0]);
    } else {
      onSubmit(processedQuestions);
    }
  };

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

  // Process initial data to flatten options array for form
  const formInitialData = {
    question: safeInitialData.question || "",
    option1: safeInitialData.options?.[0] || "",
    option2: safeInitialData.options?.[1] || "",
    option3: safeInitialData.options?.[2] || "",
    option4: safeInitialData.options?.[3] || "",
    correctAnswer: safeInitialData.correctAnswer || "",
    explanation: safeInitialData.explanation || "",
  };

  // Prepare initial data for dynamic form
  const prepareInitialData = () => {
    if (mode === "edit" && safeInitialData.question) {
      // For edit mode, return single question data
      return [formInitialData];
    }
    // For add mode, return empty array (component will initialize with one empty question)
    return [];
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || defaultTitle}
      icon={icon || defaultIcon}
      maxWidth="900px"
    >
      <DynamicQuestionsForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
        isLoading={isLoading}
        initialData={prepareInitialData()}
      />
    </GenericModal>
  );
};

export default QuestionFormModal;
