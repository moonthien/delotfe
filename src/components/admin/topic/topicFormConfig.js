// Topic form configuration
export const defaultTopicFormFields = [
  {
    name: "grade",
    label: "Lớp",
    type: "select",
    placeholder: "Chọn lớp...",
    required: true,
    options: [
      { value: "1", label: "Lớp 1" },
      { value: "2", label: "Lớp 2" },
      { value: "3", label: "Lớp 3" },
      { value: "4", label: "Lớp 4" },
      { value: "5", label: "Lớp 5" },
    ],
  },
  {
    name: "subjectId",
    label: "Môn học",
    type: "select",
    placeholder: "Chọn môn học...",
    required: true,
    options: [], // Will be populated dynamically based on selected grade
  },
  {
    name: "title",
    label: "Tên chủ đề",
    type: "text",
    placeholder: "Nhập tên chủ đề...",
    required: true,
  },
];

export const defaultTopicValidationRules = {
  grade: {
    required: "Lớp là bắt buộc",
  },
  title: {
    required: "Tên chủ đề là bắt buộc",
    minLength: {
      value: 2,
      message: "Tên chủ đề phải có ít nhất 2 ký tự",
    },
    maxLength: {
      value: 100,
      message: "Tên chủ đề không được quá 100 ký tự",
    },
  },
  subjectId: {
    required: "Môn học là bắt buộc",
  },
};
