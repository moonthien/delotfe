// Question form configuration for dynamic multiple questions
export const defaultQuestionFormFields = [
  {
    name: "isReadingQuestion",
    label: "Câu hỏi đọc hiểu",
    type: "checkbox",
    required: false,
    defaultValue: false,
  },
  {
    name: "textPassage",
    label: "Đoạn văn",
    type: "textarea",
    placeholder: "Nhập đoạn văn để đọc hiểu (nếu có)...",
    required: false,
    rows: 5,
    showWhen: {
      field: "isReadingQuestion",
      value: true,
    },
  },
  {
    name: "questionType",
    label: "Loại câu hỏi",
    type: "select",
    placeholder: "Chọn loại câu hỏi...",
    required: true,
    options: [
      { value: "multiple_choice", label: "Trắc nghiệm" },
      { value: "essay", label: "Tự luận" },
    ],
  },
  {
    name: "questions",
    label: "Danh sách câu hỏi",
    type: "dynamic_questions",
    required: true,
  },
];

// Single question field template for multiple choice
export const multipleChoiceQuestionFields = [
  {
    name: "question",
    label: "Câu hỏi",
    type: "textarea",
    placeholder: "Nhập nội dung câu hỏi...",
    required: true,
  },
  {
    name: "optionA",
    label: "Đáp án A",
    type: "text",
    placeholder: "Nhập đáp án A...",
    required: true,
  },
  {
    name: "optionB",
    label: "Đáp án B",
    type: "text",
    placeholder: "Nhập đáp án B...",
    required: true,
  },
  {
    name: "optionC",
    label: "Đáp án C",
    type: "text",
    placeholder: "Nhập đáp án C...",
    required: true,
  },
  {
    name: "optionD",
    label: "Đáp án D",
    type: "text",
    placeholder: "Nhập đáp án D...",
    required: true,
  },
  {
    name: "correctAnswer",
    label: "Đáp án đúng",
    type: "select",
    placeholder: "Chọn đáp án đúng...",
    required: true,
    options: [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
    ],
  },
];

// Single question field template for essay
export const essayQuestionFields = [
  {
    name: "question",
    label: "Câu hỏi",
    type: "textarea",
    placeholder: "Nhập nội dung câu hỏi...",
    required: true,
  },
  {
    name: "sampleAnswer",
    label: "Gợi ý đáp án (tùy chọn)",
    type: "textarea",
    placeholder: "Nhập gợi ý đáp án cho câu tự luận...",
    required: false,
  },
];

export const defaultQuestionValidationRules = {
  questionType: {
    required: "Loại câu hỏi là bắt buộc",
  },
  textPassage: {
    validate: {
      requiredWhenReading: (value, { isReadingQuestion }) => {
        if (isReadingQuestion && (!value || value.trim() === "")) {
          return "Đoạn văn là bắt buộc khi chọn câu hỏi đọc hiểu";
        }
        return true;
      },
    },
  },
  questions: {
    required: "Phải có ít nhất một câu hỏi",
    validate: {
      minLength: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return "Phải có ít nhất một câu hỏi";
        }
        return true;
      },
    },
  },
};
